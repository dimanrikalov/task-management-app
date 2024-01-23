import {
	Injectable,
	ConflictException,
	NotFoundException,
	ForbiddenException,
	BadRequestException
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { TasksService } from 'src/tasks/tasks.service';
import { BaseUsersDto } from 'src/users/dtos/base.dto';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { DeleteBoardDto } from './dtos/deleteboard.dto';
import { RenameBoardDto } from './dtos/renameBoard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBoardDetails } from './dtos/getBoardDetails.dto';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { GetWorkspaceDetails } from 'src/workspaces/dtos/getWorkspaceDetails.dto';

@Injectable()
export class BoardsService {
	constructor(
		private readonly tasksService: TasksService,
		private readonly prismaService: PrismaService,
		private readonly columnsService: ColumnsService,
		private readonly messagesService: MessagesService,
		private readonly notificationsService: NotificationsService
	) {}

	async getWorkpaceByIdLocal(body: GetWorkspaceDetails) {
		const workspaceBoards = await this.prismaService.board.findMany({
			where: {
				workspaceId: body.workspaceData.id
			}
		});
		const workspaceUsersResult =
			await this.prismaService.user_Workspace.findMany({
				where: {
					workspaceId: body.workspaceData.id
				},
				select: {
					User: {
						select: {
							id: true,
							username: true,
							profileImagePath: true
						}
					}
				}
			});

		const workspaceUsers = workspaceUsersResult.map((user) => {
			const imageBuffer = fs.readFileSync(user.User.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return {
				...user.User,
				profileImagePath: imageBinary
			};
		});
		const workspaceOwner = await this.prismaService.user.findUnique({
			where: {
				id: body.workspaceData.ownerId
			},
			select: {
				id: true,
				username: true,
				profileImagePath: true
			}
		});

		workspaceOwner.profileImagePath = Buffer.from(
			fs.readFileSync(join(workspaceOwner.profileImagePath))
		).toString('base64');

		const data = {
			...body.workspaceData,
			boards: workspaceBoards,
			workspaceUsers,
			workspaceOwner
		};

		delete data.ownerId;

		return data;
	}

	async getUserBoards(body: BaseUsersDto) {
		const boards = await this.prismaService.board.findMany({
			where: {
				OR: [
					{
						// Boards related to workspaces where the user has access
						Workspace: {
							User_Workspace: {
								some: {
									userId: body.userData.id
								}
							}
						}
					},
					{
						// Boards where the user is the workspace creator
						Workspace: {
							ownerId: body.userData.id
						}
					},
					{
						// Boards where the user has direct access
						User_Board: {
							some: {
								userId: body.userData.id
							}
						}
					}
				]
			},
			select: {
				id: true,
				name: true,
				Workspace: {
					select: {
						id: true,
						name: true
					}
				}
			},
			distinct: ['id']
		});

		return await Promise.all(
			boards.map(async (board) => {
				const usersWithBoardAccess =
					await this.prismaService.user.count({
						where: {
							OR: [
								{
									User_Board: {
										some: {
											boardId: board.id
										}
									}
								},
								{
									User_Workspace: {
										some: {
											workspaceId: board.Workspace.id
										}
									}
								}
							]
						}
					});

				const res = {
					...board,
					usersCount: usersWithBoardAccess + 1,
					workspaceName: board.Workspace.name
				};

				delete res.Workspace;

				return res;
			})
		);
	}

	async getBoardById(body: GetBoardDetails) {
		const board = body.boardData;
		const boardId = body.boardData.id;

		const boardColumns = await this.prismaService.column.findMany({
			where: {
				boardId
			},
			orderBy: {
				position: 'asc'
			}
		});

		const boardTasks = await this.prismaService.task.findMany({
			where: {
				columnId: {
					in: boardColumns.map((column) => column.id)
				}
			}
		});

		const boardSteps = await this.prismaService.step.findMany({
			where: {
				taskId: {
					in: boardTasks.map((task) => task.id)
				}
			}
		});

		const tasks = boardTasks.map((task) => {
			const steps = boardSteps.filter((step) => step.taskId === task.id);
			if (task.attachmentImgPath) {
				const imageBuffer = fs.readFileSync(task.attachmentImgPath);
				const imageBinary = Buffer.from(imageBuffer).toString('base64');
				return { ...task, attachmentImgPath: imageBinary, steps };
			}

			return { ...task, steps };
		});

		const columns = boardColumns.map((column) => {
			const columnTasks = tasks
				.filter((task) => task.columnId === column.id)
				.sort((task_a, task_b) => task_a.position - task_b.position);

			return { ...column, tasks: columnTasks };
		});

		const boardUsersResult = await this.prismaService.user_Board.findMany({
			where: {
				boardId: body.boardData.id
			},
			select: {
				User: {
					select: {
						id: true,
						username: true,
						profileImagePath: true
					}
				}
			}
		});

		const boardUsers = boardUsersResult.map((user) => {
			const imageBuffer = fs.readFileSync(user.User.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return {
				...user.User,
				profileImagePath: imageBinary
			};
		});

		const workspace = await this.getWorkpaceByIdLocal({
			userData: body.userData,
			workspaceData: body.workspaceData
		});

		return {
			...board,
			columns,
			workspace,
			boardUsers
		};
	}

	async create(body: CreateBoardDto) {
		if (
			body.colleagues &&
			body.colleagues.length > 0 &&
			body.workspaceData.name.toLowerCase().trim() ===
				'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot add colleagues to boards belonging to your Personal Workspace!'
			);
		}

		// Handle the case where no colleagues array is passed
		body.colleagues = body.colleagues || [];

		//if the user somehow decides to add themself
		if (body.colleagues.includes(body.userData.id)) {
			throw new ForbiddenException(
				'You cannot add yourself as a colleague!'
			);
		}
		//if the user tries to add 'Deleted User'
		if (body.colleagues.includes(0)) {
			throw new ForbiddenException(
				'Invalid colleague ID(s)! Double check and try again!'
			);
		}
		//if the user tries to add the workspace owner
		if (body.colleagues.includes(body.workspaceData.ownerId)) {
			throw new ForbiddenException(
				'You cannot add the workspace creator to a board from the workspace!'
			);
		}

		//check if colleague users actually exist
		const colleagues = await this.prismaService.user.findMany({
			where: {
				id: {
					in: body.colleagues
				}
			}
		});

		if (colleagues.length < body.colleagues.length) {
			throw new NotFoundException(
				'Invalid colleague ID(s)! Double check and try again!'
			);
		}

		const validColleagueIds = colleagues.map((colleague) => colleague.id);

		//find all users that dont have user_workspace entry with same workspace ID
		const usersWithoutWorkspaceAccess =
			await this.prismaService.user.findMany({
				where: {
					AND: [
						{
							NOT: {
								User_Workspace: {
									some: {
										workspaceId: body.workspaceData.id
									}
								}
							}
						},
						{
							id: {
								in: validColleagueIds
							}
						}
					]
				},
				select: {
					id: true
				}
			});

		if (usersWithoutWorkspaceAccess.length < validColleagueIds.length) {
			throw new ForbiddenException(
				'You cannot add users with workspace access to the board!'
			);
		}

		const board = await this.prismaService.board.create({
			data: {
				name: body.name,
				workspaceId: body.workspaceData.id
			}
		});

		//create the default board columns
		await this.prismaService.column.createMany({
			data: [
				{
					name: 'To Do',
					position: 0,
					boardId: board.id
				},
				{
					name: 'Doing',
					position: 1,
					boardId: board.id
				},
				{
					name: 'Done',
					position: 2,
					boardId: board.id
				}
			]
		});

		//add colleagues to board
		await Promise.all(
			usersWithoutWorkspaceAccess.map(async (colleague) => {
				await this.prismaService.user_Board.create({
					data: {
						userId: colleague.id,
						boardId: board.id
					}
				});
			})
		);

		//create notifications
		const usersToNotify = await this.tasksService.getBoardUsers(
			board,
			body.workspaceData,
			body.userData.id
		);

		await Promise.all(
			usersToNotify.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has 
					created and added you to board "${body.name}".`
				});
			})
		);

		return board;
	}

	async rename(body: RenameBoardDto) {
		await this.prismaService.board.update({
			where: {
				id: body.boardData.id
			},
			data: {
				...body.boardData,
				name: body.newName
			}
		});

		const usersToNotify = await this.tasksService.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		await Promise.all(
			usersToNotify.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has renamed
					 board "${body.boardData.name}" to "${body.newName}".`
				});
			})
		);
	}

	async delete(body: DeleteBoardDto) {
		const usersToNotify = await this.tasksService.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		//delete the relationship entries concerning the board to be deleted
		await this.prismaService.user_Board.deleteMany({
			where: {
				boardId: body.boardData.id
			}
		});

		//deletes all columns, tasks and steps cascadingly
		await this.columnsService.deleteMany(body.boardData.id);

		//delete all chat messages
		await this.messagesService.deleteAll(body.boardData.id);

		//delete the board
		await this.prismaService.board.delete({
			where: {
				id: body.boardData.id
			}
		});

		await Promise.all(
			usersToNotify.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has
					 deleted board "${body.boardData.name}".`
				});
			})
		);
	}

	async deleteMany(workspaceId: number) {
		const boards = await this.prismaService.board.findMany({
			where: {
				workspaceId
			}
		});

		const boardIds = boards.map((board) => board.id);

		//delete all messages
		await this.prismaService.message.deleteMany({
			where: {
				boardId: {
					in: boardIds
				}
			}
		});

		//delete all columns from all boards
		await Promise.all(
			boardIds.map(async (boardId) => {
				await this.columnsService.deleteMany(boardId);
			})
		);

		//remove any user_boards relationship with the deleted boards
		await this.prismaService.user_Board.deleteMany({
			where: {
				boardId: {
					in: boardIds
				}
			}
		});

		//delete the boards themselves
		await this.prismaService.board.deleteMany({
			where: {
				workspaceId
			}
		});
	}

	async addColleague(body: EditBoardColleagueDto) {
		const colleagueId = Number(body.colleagueId);
		if (
			body.workspaceData.name.toLowerCase().trim() ===
			'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot add colleagues to personal boards!'
			);
		}

		//check the user to be added (it must not be the user themself, a user with access to the workspace where the board is, or the owner)
		if (colleagueId === 0) {
			// 'Deleted User' id
			throw new ForbiddenException('Invalid colleague ID!');
		}

		const userIsAddingThemself = colleagueId === body.userData.id;

		const colleagueIsWorkspaceOwner =
			body.workspaceData.ownerId === colleagueId;

		const colleagueIsPartOfWorkspace =
			await this.prismaService.user_Workspace.findFirst({
				where: {
					AND: [
						{ userId: colleagueId },
						{ workspaceId: body.workspaceData.id }
					]
				}
			});

		const colleagueIsPartOfBoard =
			await this.prismaService.user_Board.findFirst({
				where: {
					AND: [
						{ userId: colleagueId },
						{ boardId: body.boardData.id }
					]
				}
			});

		if (
			userIsAddingThemself ||
			colleagueIsPartOfBoard ||
			colleagueIsWorkspaceOwner ||
			colleagueIsPartOfWorkspace
		) {
			throw new ConflictException(
				'User already has access to the board!'
			);
		}

		await this.prismaService.user_Board.create({
			data: {
				userId: colleagueId,
				boardId: body.boardData.id
			}
		});

		const boardUserIds = await this.tasksService.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		const colleague = await this.prismaService.user.findFirst({
			where: {
				id: body.colleagueId
			}
		});

		await Promise.all(
			boardUserIds.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has added
					 ${colleague.username} to board "${body.boardData.name}".`
				});
			})
		);
	}

	async removeColleague(body: EditBoardColleagueDto) {
		const colleagueId = Number(body.colleagueId);

		if (
			body.workspaceData.name.toLowerCase().trim() ===
			'personal workspace'
		) {
			throw new ForbiddenException(
				'You cannot remove colleagues from personal boards!'
			);
		}

		if (colleagueId === 0) {
			throw new ForbiddenException('Invalid colleague ID!');
		}
		if (colleagueId === body.userData.id) {
			throw new ForbiddenException(
				'You cannot remove yourself from the board!'
			);
		}
		if (body.workspaceData.ownerId === colleagueId) {
			throw new ForbiddenException(
				'You cannot remove the workspace owner from a board that is part of the same workspace!'
			);
		}

		const colleagueIsPartOfWorkspace =
			await this.prismaService.user_Workspace.findFirst({
				where: {
					AND: [
						{ userId: colleagueId },
						{ workspaceId: body.workspaceData.id }
					]
				}
			});
		if (colleagueIsPartOfWorkspace) {
			throw new ForbiddenException(
				'You cannot remove a user with access to the workspace from the board!'
			);
		}

		const colleagueIsPartOfBoard =
			await this.prismaService.user_Board.findFirst({
				where: {
					AND: [
						{ userId: colleagueId },
						{ boardId: body.boardData.id }
					]
				}
			});
		if (!colleagueIsPartOfBoard) {
			throw new BadRequestException('User is not part of the board!');
		}

		const boardUserIds = await this.tasksService.getBoardUsers(
			body.boardData,
			body.workspaceData,
			body.userData.id
		);

		const colleague = await this.prismaService.user.findFirst({
			where: {
				id: body.colleagueId
			}
		});

		await Promise.all(
			boardUserIds.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has removed
					 ${colleague.username} from board "${body.boardData.name}".`
				});
			})
		);

		await this.prismaService.user_Board.deleteMany({
			where: {
				AND: [{ userId: colleagueId }, { boardId: body.boardData.id }]
			}
		});
	}
}
