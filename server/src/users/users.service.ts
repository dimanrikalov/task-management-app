import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { IUser } from './users.interfaces';
import { Injectable } from '@nestjs/common';
import { BaseUsersDto } from './dtos/base.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { IJWTPayload } from '../jwt/jwt.interfaces';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { refreshJWTTokens } from 'src/jwt/refreshJWTTokens';
import { IRefreshTokensBody } from './dtos/users.interfaces';
import { generateJWTTokens } from 'src/jwt/generateJWTTokens';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

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

    async getAll() {
        return this.prismaService.user.findMany({
            where: {
                NOT: {
                    id: 0,
                },
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
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            profileImagePath: 'default_image_path',
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

        const payload: IJWTPayload = {
            id: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
        };

        //create authorization token + refresh token
        const { accessToken, refreshToken } = generateJWTTokens(payload);

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
            ...(body.firstName && { firstName: body.firstName }),
            ...(body.lastName && { lastName: body.lastName }),
            ...(hashedPassword && { password: hashedPassword }),
        };

        await this.prismaService.user.update({
            where: {
                id: body.userData.id,
            },
            data,
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
