import * as bcrypt from 'bcrypt';
import { IUser } from './users.interfaces';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dtos/editUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { DeleteUserDto } from './dtos/deleteUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { refreshJWTToken } from 'src/jwt/refreshJWTToken';
import { generateJWTTokens } from 'src/jwt/generateJWTTokens';
import { IGenerateTokens, IJWTPayload } from '../jwt/jwt.interfaces';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    async getAll(): Promise<IUser[]> {
        return this.prismaService.user.findMany();
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
            firstName: body.first_name,
            lastName: body.last_name,
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

    async signIn(body: LoginUserDto): Promise<IGenerateTokens> {
        const user = await this.findUserByEmail(body.email);

        //user must not be able to log in as Deleted_User
        if (user.email === 'Deleted_User') {
            throw new Error('Invalid login email!');
        }

        if (!user) {
            throw new Error('Wrong email or password!');
        }

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
        return generateJWTTokens(payload);
    }

    async update(body: EditUserDto): Promise<void> {
        const hashedPassword = body.password
            ? await bcrypt.hash(body.password, process.env.SALT_ROUNDS)
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

    refreshToken(refreshToken: string): string {
        return refreshJWTToken(refreshToken);
    }

    async delete(userId: number) {
        //create "Deleted User" if none exists
        let deletedUser = await this.prismaService.user.findFirst({
            where: {
                email: 'Deleted_User',
            },
        });
        if (!deletedUser) {
            deletedUser = await this.prismaService.user.create({
                data: {
                    email: 'Deleted_User',
                    firstName: 'Deleted',
                    lastName: 'User',
                    password: '1',
                    profileImagePath: '/',
                },
            });
        }

        //transfer all messages to "Deleted user"
        await this.prismaService.message.updateMany({
            where: {
                writtenBy: userId,
            },
            data: {
                writtenBy: deletedUser.id,
            },
        });

        //transfer all takss to "Deleted user"
        await this.prismaService.task.updateMany({
            where: {
                assigneeId: userId,
            },
            data: {
                assigneeId: deletedUser.id,
            },
        });
    }
}
