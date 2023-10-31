import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindUserDto } from './dtos/find-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { IJWTPayload } from 'src/interfaces/IJWTPayload.interface';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async findUserByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({
            where: {
                email,
            },
        });
    }

    async findAll(): Promise<User[]> {
        return this.userModel.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });
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
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
                password: hashedPassword, // Save the hashed password
                profile_image_path: 'default_image_path',
            };

            // You can use the createUser method to create a new user in the database
            const user = await this.userModel.create(payload);

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
            const user = await this.userModel.findOne({
                where: {
                    email: body.email,
                },
            });

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
                first_name: user.first_name,
                last_name: user.last_name,
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
