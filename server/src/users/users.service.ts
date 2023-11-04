import * as bcrypt from 'bcrypt';
import { IUser } from './users.interfaces';
import { Injectable } from '@nestjs/common';
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

    refreshToken(refreshToken: string): { accessToken: string } {
        return refreshJWTToken(refreshToken);
    }

    async delete(tokenBody: DeleteUserDto) {
        // to do
    }
}
