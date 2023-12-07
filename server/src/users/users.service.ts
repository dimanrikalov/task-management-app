import * as fs from 'fs';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { IUser } from './users.interfaces';
import { Injectable } from '@nestjs/common';
import { BaseUsersDto } from './dtos/base.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { FindUserDto } from './dtos/findUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfleImgDto } from './dtos/editProfleImg.dto';
import { refreshJWTTokens } from 'src/jwt/refreshJWTTokens';
import { IRefreshTokensBody } from './dtos/users.interfaces';
import { generateJWTTokens } from 'src/jwt/generateJWTTokens';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly workspaceService: WorkspacesService,
    ) {}

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    async getAll(body: FindUserDto) {
        return this.prismaService.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            notIn: [0, body.userData.id, ...body.notIn],
                        },
                    },
                    {
                        email: {
                            contains: body.email,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImagePath: true,
            },
        });
    }

    async getUserById(userId: number) {
        console.log(userId);
        const data = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        delete data.password;
        return data;
    }

    async getUserStats(userId: number) {
        const messagesCount = await this.prismaService.message.count({
            where: {
                writtenBy: userId,
            },
        });

        const userTasks = await this.prismaService.task.findMany({
            where: {
                assigneeId: userId,
            },
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
                        ownerId: userId,
                    },
                    {
                        User_Workspace: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        const boardsCount = await this.prismaService.board.count({
            where: {
                OR: [
                    {
                        // Boards related to workspaces where the user has access
                        Workspace: {
                            User_Workspace: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                    {
                        // Boards where the user is the workspace creator
                        Workspace: {
                            ownerId: userId,
                        },
                    },
                    {
                        // Boards where the user has direct access
                        User_Board: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
        });

        return {
            boardsCount,
            messagesCount,
            workspacesCount,
            pendingTasksCount,
            completedTasksCount,
        };
    }

    async signUp(body: CreateUserDto): Promise<void> {
        const isEmailTaken = await this.findUserByEmail(body.email);
        if (isEmailTaken) {
            throw new Error('Email is already taken!');
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(
            body.password,
            Number(process.env.SALT_ROUNDS),
        );

        const userData = {
            email: body.email,
            lastName: body.lastName,
            password: hashedPassword,
            firstName: body.firstName,
            profileImagePath: process.env.DEFAULT_PROFILE_IMG_URL,
        };

        const user = await this.prismaService.user.create({
            data: userData,
        });

        // Create default 'Personal Workspace'
        await this.prismaService.workspace.create({
            data: {
                name: 'Personal Workspace',
                ownerId: user.id,
            },
        });
    }

    async signIn(res: Response, body: LoginUserDto): Promise<void> {
        const user = await this.findUserByEmail(body.email);

        if (!user) {
            throw new Error('Wrong email or password!');
        }

        //user will not be able to login as Deleted_User as the email property does not have '@' and the LoginUserDto will prevent from reaching this service

        const isValidPassword = await bcrypt.compare(
            body.password,
            user.password,
        );
        if (!isValidPassword) {
            throw new Error('Wrong email or password!');
        }

        //create authorization token + refresh token
        const { accessToken, refreshToken } = generateJWTTokens({
            id: user.id,
        });

        //set the accessToken and refreshToken as cookies
        res.cookie('accessToken', accessToken, {
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        });
    }

    async update(body: EditUserDto): Promise<void> {
        const hashedPassword = body.password
            ? await bcrypt.hash(body.password, Number(process.env.SALT_ROUNDS))
            : undefined;

        const data = {
            ...(body.lastName && { lastName: body.lastName }),
            ...(hashedPassword && { password: hashedPassword }),
            ...(body.firstName && { firstName: body.firstName }),
        };

        await this.prismaService.user.update({
            where: {
                id: body.userData.id,
            },
            data,
        });
    }

    async updateProfileImg(body: EditProfleImgDto): Promise<void> {
        const { id } = extractJWTData(body.token);
        const userData = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });

        if (!userData) {
            throw new Error('User not found');
        }

        console.log(userData.profileImagePath);
        console.log(process.env.DEFAULT_PROFILE_IMG_URL);

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
                id: userData.id,
            },
            data: {
                profileImagePath: body.profileImagePath,
            },
        });
    }

    refreshTokens({ payload, refreshToken }: IRefreshTokensBody) {
        return refreshJWTTokens({ payload, refreshToken });
    }

    async delete(body: BaseUsersDto) {
        //create "Deleted User" (id:0) if none exists
        let deletedUser = await this.prismaService.user.findUnique({
            where: {
                id: 0,
            },
        });
        if (!deletedUser) {
            deletedUser = await this.prismaService.user.create({
                data: {
                    id: 0,
                    email: 'Deleted_User',
                    firstName: 'Deleted',
                    lastName: 'User',
                    password: '*******',
                    profileImagePath: '/',
                },
            });
        }

        //transfer all messages to "Deleted user"
        await this.prismaService.message.updateMany({
            where: {
                writtenBy: body.userData.id,
            },
            data: {
                writtenBy: deletedUser.id,
            },
        });

        //transfer all tasks to "Deleted user"
        await this.prismaService.task.updateMany({
            where: {
                assigneeId: deletedUser.id,
            },
            data: {
                assigneeId: deletedUser.id,
            },
        });

        //delete all relationships with other users' boards
        await this.prismaService.user_Board.deleteMany({
            where: {
                userId: body.userData.id,
            },
        });

        //delete all relationships with other users' workspaces
        await this.prismaService.user_Workspace.deleteMany({
            where: {
                userId: body.userData.id,
            },
        });

        //delete user workspaces
        await this.workspaceService.deleteMany(body.userData.id);

        //delete the user
        await this.prismaService.user.delete({
            where: {
                id: body.userData.id,
            },
        });
    }
}
