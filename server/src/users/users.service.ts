import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dtos/findUser.dto';
import { IUser } from 'src/interfaces/user.interface';
import { CreateUserDto } from './dtos/createUser.dto';
import { DeleteUserDto } from './dtos/deleteUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJWTPayload } from 'src/interfaces/JWTPayload.interface';

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

    async findAll(): Promise<IUser[]> {
        return this.prismaService.user.findMany();
    }

    async signUp(body: CreateUserDto): Promise<string> {
        try {
            const isEmailTaken = await this.findUserByEmail(body.email);
            if (isEmailTaken) {
                throw new Error('Email is taken!');
            }

            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(body.password, 10); // You can adjust the saltRounds

            const payload = {
                firstName: body.first_name,
                lastName: body.last_name,
                email: body.email,
                password: hashedPassword, // Save the hashed password
                profileImagePath: 'default_image_path',
            };

            // You can use the createUser method to create a new user in the database
            const user = await this.prismaService.user.create({
                data: payload,
            });

            const tokenData: IJWTPayload = {
                id: user.id,
                email: body.email,
                first_name: body.first_name,
                last_name: body.last_name,
            };

            return jwt.sign(tokenData, process.env.JWT_SECRET);
        } catch (err: any) {
            // Handle any errors that occur during the creation process
            return err.message;
        }
    }

    async signIn(body: FindUserDto): Promise<string> {
        try {
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

            const tokenData: IJWTPayload = {
                id: user.id,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
            };

            return jwt.sign(tokenData, process.env.JWT_SECRET);
        } catch (err: any) {
            return err.message;
        }
    }

    async delete(tokenBody: DeleteUserDto) {
        // to do
    }
}
