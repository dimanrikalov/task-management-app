import {
    Injectable,
    ConflictException,
    NotFoundException
} from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { IUser } from './users.interfaces';
import { BaseUsersDto } from './dtos/base.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { FindUserDto } from './dtos/findUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { IGenerateTokens } from 'src/jwt/jwt.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfleImgDto } from './dtos/editProfleImg.dto';
import { refreshJWTTokens } from 'src/jwt/refreshJWTTokens';
import { IRefreshTokensBody } from './dtos/users.interfaces';
import { generateJWTTokens } from 'src/jwt/generateJWTTokens';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

const unlink = promisify(fs.unlink);

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly workspaceService: WorkspacesService
    ) {}

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.prismaService.user.findFirst({
            where: {
                email
            }
        });
    }

    async getAllUsers() {
        const matches = await this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                lastName: true,
                firstName: true,
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
                        email: {
                            contains: body.email,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
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

        const hoursSpent = userTasks.reduce(
            (acc, task) => acc + task.hoursSpent,
            0
        );
        const minutesSpent = userTasks.reduce(
            (acc, task) => acc + task.minutesSpent,
            0
        );
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

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(
            body.password,
            Number(process.env.SALT_ROUNDS)
        );

        const userData = {
            email: body.email,
            lastName: body.lastName,
            password: hashedPassword,
            firstName: body.firstName,
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
        const hashedPassword = body.password
            ? await bcrypt.hash(body.password, Number(process.env.SALT_ROUNDS))
            : undefined;

        const data = {
            ...(body.lastName && { lastName: body.lastName }),
            ...(hashedPassword && { password: hashedPassword }),
            ...(body.firstName && { firstName: body.firstName })
        };

        await this.prismaService.user.update({
            where: {
                id: body.userData.id
            },
            data
        });
    }

    async updateProfileImg(body: EditProfleImgDto): Promise<void> {
        const { id } = extractJWTData(body.token);
        const userData = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });

        if (!userData) {
            throw new Error('User not found');
        }

        // Check if the file exists before attempting to delete it
        if (
            fs.existsSync(userData.profileImagePath) &&
            userData.profileImagePath !== process.env.DEFAULT_PROFILE_IMG_URL
        ) {
            try {
                // Delete the existing file
                await unlink(userData.profileImagePath);
                console.log('File deleted successfully');
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        // Update the user's profile image path
        await this.prismaService.user.update({
            where: {
                id: userData.id
            },
            data: {
                profileImagePath: body.profileImagePath
            }
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
                    lastName: 'User',
                    password: '*******',
                    firstName: 'Deleted',
                    email: 'Deleted_User',
                    profileImagePath: process.env.DEFAULT_PROFILE_IMG_URL
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
        await this.workspaceService.deleteMany(body.userData.id);

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

        //delete the user
        await this.prismaService.user.delete({
            where: {
                id: body.userData.id
            }
        });
    }
}
