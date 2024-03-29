import {
	Injectable,
	ConflictException,
	NotFoundException,
	NotAcceptableException
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import { IUser } from './users.interfaces';
import { BaseUsersDto } from './dtos/base.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { FindUserDto } from './dtos/findUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { IGenerateTokens } from 'src/jwt/jwt.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { refreshJWTTokens } from 'src/jwt/refreshJWTTokens';
import { IRefreshTokensBody } from './dtos/users.interfaces';
import { generateJWTTokens } from 'src/jwt/generateJWTTokens';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { NotificationsService } from 'src/notifications/notifications.service';

const unlink = promisify(fs.unlink);

@Injectable()
export class UsersService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly workspaceService: WorkspacesService,
		private readonly notificationsService: NotificationsService
	) {}

	async findUserByEmail(email: string): Promise<IUser> {
		return await this.prismaService.user.findFirst({
			where: {
				email
			}
		});
	}

	async findUserByUsername(username: string): Promise<IUser> {
		return await this.prismaService.user.findFirst({
			where: {
				username
			}
		});
	}

	async getAllUsers() {
		const matches = await this.prismaService.user.findMany({
			select: {
				id: true,
				email: true,
				username: true,
				profileImagePath: true
			}
		});

		return matches.map((match) => {
			const imageBuffer = fs.readFileSync(match.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return {
				...match,
				profileImagePath: imageBinary
			};
		});
	}

	async getAllOtherUsers(body: FindUserDto) {
		const matches = await this.prismaService.user.findMany({
			where: {
				AND: [
					{
						id: {
							notIn: [0, body.userData.id, ...body.notIn]
						}
					},
					{
						username: {
							contains: body.username,
							mode: 'insensitive'
						}
					}
				]
			},
			select: {
				id: true,
				email: true,
				username: true,
				profileImagePath: true
			}
		});

		return matches.map((match) => {
			const imageBuffer = fs.readFileSync(match.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return {
				...match,
				profileImagePath: imageBinary
			};
		});
	}

	async getUserById(userId: number) {
		const data = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		});
		delete data.password;
		return data;
	}

	async getUserStats(userId: number) {
		const messagesCount = await this.prismaService.message.count({
			where: {
				writtenBy: userId
			}
		});

		const userTasks = await this.prismaService.task.findMany({
			where: {
				assigneeId: userId
			}
		});

		const completedTasksCount = userTasks.reduce((acc, task) => {
			if (task.progress === 100) {
				return acc + 1;
			}
			return acc;
		}, 0);

		const pendingTasksCount = userTasks.length - completedTasksCount;

		const workspacesCount = await this.prismaService.workspace.count({
			where: {
				OR: [
					{
						ownerId: userId
					},
					{
						User_Workspace: {
							some: {
								userId
							}
						}
					}
				]
			}
		});

		const boards = await this.prismaService.board.findMany({
			where: {
				OR: [
					{
						// Boards related to workspaces where the user has access
						Workspace: {
							User_Workspace: {
								some: {
									userId
								}
							}
						}
					},
					{
						// Boards where the user is the workspace creator
						Workspace: {
							ownerId: userId
						}
					},
					{
						// Boards where the user has direct access
						User_Board: {
							some: {
								userId
							}
						}
					}
				]
			},
			distinct: 'id'
		});

		const stepsCompleted = await this.prismaService.step.count({
			where: {
				AND: [
					{
						Task: {
							assigneeId: userId
						}
					},
					{
						isComplete: true
					}
				]
			}
		});

		/*
		calculate timespent based on this logic:
			1. check if hours (minutes respectively) is 00 (i.e user hasnt inputted anything)
			2. if startedAt and completedAt are valid values use them
			3. if they are not use the 00 value
		*/

		let hoursSpent = userTasks.reduce((acc, task) => {
			if (task.hoursSpent !== 0) {
				return acc + task.hoursSpent;
			}

			if (task.startedAt) {
				const taskDuration = task.completedAt
					? task.completedAt.getTime() - task.startedAt.getTime()
					: new Date().getTime() - task.startedAt.getTime();
				const taskHours = Math.floor(taskDuration / (1000 * 60 * 60));
				return acc + taskHours;
			}

			return acc;
		}, 0);

		let minutesSpent = userTasks.reduce((acc, task) => {
			if (task.minutesSpent !== 0) {
				return acc + task.minutesSpent;
			}

			if (task.startedAt) {
				const taskDuration = task.completedAt
					? task.completedAt.getTime() - task.startedAt.getTime()
					: new Date().getTime() - task.startedAt.getTime();
				const taskMinutes = Math.floor(
					(taskDuration / (1000 * 60)) % 60
				);
				return acc + taskMinutes;
			}

			return acc;
		}, 0);

		hoursSpent += Math.floor(minutesSpent / 60);
		minutesSpent %= 60;

		const columnsCount = await this.prismaService.column.count({
			where: {
				boardId: {
					in: boards.map((board) => board.id)
				}
			}
		});

		const boardsCount = boards.length;

		return {
			hoursSpent,
			boardsCount,
			columnsCount,
			minutesSpent,
			messagesCount,
			stepsCompleted,
			workspacesCount,
			pendingTasksCount,
			completedTasksCount
		};
	}

	async signUp(body: CreateUserDto): Promise<void> {
		const isEmailTaken = await this.findUserByEmail(body.email);
		if (isEmailTaken) {
			throw new ConflictException('Email is already taken!');
		}

		const isUsernameTaken = await this.findUserByUsername(body.username);
		if (isUsernameTaken) {
			throw new ConflictException('Username is already taken!');
		}

		// Hash the password before saving it
		const hashedPassword = await bcrypt.hash(
			body.password,
			Number(process.env.SALT_ROUNDS)
		);

		const userData = {
			email: body.email,
			username: body.username,
			password: hashedPassword,
			profileImagePath: process.env.DEFAULT_PROFILE_IMG_URL
		};

		const user = await this.prismaService.user.create({
			data: userData
		});

		// Create default 'Personal Workspace'
		await this.prismaService.workspace.create({
			data: {
				name: 'Personal Workspace',
				ownerId: user.id
			}
		});
	}

	async signIn(res: Response, body: LoginUserDto): Promise<IGenerateTokens> {
		const user = await this.findUserByEmail(body.email);

		if (!user) {
			throw new NotFoundException('Wrong email or password!');
		}

		/* user will not be able to login as Deleted_User as the email
        property does not have '@' and the LoginUserDto will prevent from 
        reaching this service */

		const isValidPassword = await bcrypt.compare(
			body.password,
			user.password
		);
		if (!isValidPassword) {
			throw new NotFoundException('Wrong email or password!');
		}

		//create authorization token + refresh token
		const { accessToken, refreshToken } = generateJWTTokens({
			id: user.id
		});

		return {
			accessToken,
			refreshToken
		};
	}

	async update(body: EditUserDto): Promise<void> {
		if (body.username && body.username.trim().includes(' ')) {
			throw new NotAcceptableException(
				'Username cannot contain whitespaces!'
			);
		}
		const hashedPassword = body.password
			? await bcrypt.hash(body.password, Number(process.env.SALT_ROUNDS))
			: undefined;

		const data: any = {
			...(body.email && { email: body.email }),
			...(body.username && { username: body.username }),
			...(hashedPassword && { password: hashedPassword })
		};

		//image upload logic
		if (body.profileImg) {
			//check if there is already uploaded image to delete before setting the new one
			if (
				fs.existsSync(body.userData.profileImagePath) &&
				body.userData.profileImagePath !==
					process.env.DEFAULT_PROFILE_IMG_URL
			) {
				try {
					// Delete the existing file
					await unlink(body.userData.profileImagePath);
					console.log('File deleted successfully');
				} catch (error) {
					console.error('Error deleting file:', error);
				}
			}

			const uploadDir = process.env.PROFILE_IMGS_URL;

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const fileName = `profile-img-${uuid()}`;
			const filePath = join(uploadDir, fileName);

			//write to file
			fs.writeFileSync(filePath, body.profileImg, 'base64');

			data.profileImagePath = filePath;
		}

		await this.prismaService.user.update({
			where: {
				id: body.userData.id
			},
			data
		});
	}

	refreshTokens({ payload, refreshToken }: IRefreshTokensBody) {
		return refreshJWTTokens({ payload, refreshToken });
	}

	async delete(body: BaseUsersDto) {
		//create "Deleted User" (id:0) if none exists
		let deletedUser = await this.prismaService.user.findUnique({
			where: {
				id: 0
			}
		});
		if (!deletedUser) {
			deletedUser = await this.prismaService.user.create({
				data: {
					id: 0,
					password: '*******',
					email: 'DELETED_USER',
					username: 'Deleted User',
					profileImagePath: process.env.DELETED_PROFILE_IMG_URL
				}
			});
		}

		//transfer all messages to "Deleted user"
		await this.prismaService.message.updateMany({
			where: {
				writtenBy: body.userData.id
			},
			data: {
				writtenBy: deletedUser.id
			}
		});

		//transfer all tasks to "Deleted user"
		await this.prismaService.task.updateMany({
			where: {
				assigneeId: body.userData.id
			},
			data: {
				assigneeId: deletedUser.id
			}
		});

		//get the rooms of all boards and workspaces the user took part in
		const affectedWorkspaceIds = await this.prismaService.user_Workspace
			.findMany({
				where: {
					userId: body.userData.id
				}
			})
			.then((userWorkspaces) =>
				userWorkspaces.map((userWorkspace) => userWorkspace.workspaceId)
			);

		const affectedBoardIds = await this.prismaService.user_Board
			.findMany({
				where: {
					userId: body.userData.id
				}
			})
			.then((userBoards) =>
				userBoards.map((userBoards) => userBoards.boardId)
			);

		//delete all relationships with other users' boards
		await this.prismaService.user_Board.deleteMany({
			where: {
				userId: body.userData.id
			}
		});

		//delete all relationships with other users' workspaces
		await this.prismaService.user_Workspace.deleteMany({
			where: {
				userId: body.userData.id
			}
		});

		//delete user workspaces
		const affectedUserIds = await this.workspaceService.deleteMany(
			body.userData.id
		);

		//delete user image if they have one
		const userToDelete = await this.prismaService.user.findUnique({
			where: {
				id: body.userData.id
			}
		});

		if (
			fs.existsSync(userToDelete.profileImagePath) &&
			userToDelete.profileImagePath !==
				process.env.DEFAULT_PROFILE_IMG_URL
		) {
			await unlink(userToDelete.profileImagePath);
		}

		//delete all user notifications
		await this.notificationsService.deleteAllNotifications(userToDelete.id);

		//delete the user
		await this.prismaService.user.delete({
			where: {
				id: body.userData.id
			}
		});

		Promise.all(
			affectedUserIds.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has deleted their
					 profile and all of their workspaces and boards respectively.`
				});
			})
		);

		return { affectedUserIds, affectedWorkspaceIds, affectedBoardIds };
	}
}
