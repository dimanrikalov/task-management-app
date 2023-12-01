import {
    Get,
    Put,
    Req,
    Res,
    Post,
    Body,
    Delete,
    Controller,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseUsersDto } from './dtos/base.dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dtos/editUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';

@Controller('')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/user')
    async getUser(@Res() res: Response, @Body() body: BaseUsersDto) {
        try {
            const userData = await this.usersService.getUserById(
                body.userData.id,
            );
            return res.status(200).json(userData);
        } catch (err: any) {
            console.log(err.message);
            return res.status(401).json({
                errorMessage: err.message,
            });
        }
    }

    @Get('/users')
    async getUsers() {
        return this.usersService.getAll();
    }

    @Get('/users/stats')
    async getUserStatsById(
        @Res() res: Response,
        @Body() { userData }: BaseUsersDto,
    ) {
        try {
            const stats = await this.usersService.getUserStats(userData.id);
            return res.status(200).json(stats);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({ errorMessage: err.message });
        }
    }

    @Post('/users/sign-up')
    async createUser(@Res() res: Response, @Body() userBody: CreateUserDto) {
        try {
            await this.usersService.signUp(userBody);
            await this.usersService.signIn(res, userBody);
            return res.status(200).json({ message: 'Signed-up successfully!' });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/users/sign-in')
    async loginUser(@Res() res: Response, @Body() userBody: LoginUserDto) {
        try {
            await this.usersService.signIn(res, userBody);
            res.status(200).json({ message: 'Signed-in successfully!' });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/users/edit')
    async updateUser(@Res() res: Response, @Body() userBody: EditUserDto) {
        try {
            await this.usersService.update(userBody);
            return res.json({
                message: 'User credentials updated successfully!',
            });
        } catch (err: any) {
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Get('/users/refresh')
    async refreshUserTokens(@Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies['refreshToken'];

            const body = extractJWTData(refreshToken);

            const { newAccessToken, newRefreshToken } =
                this.usersService.refreshTokens({
                    refreshToken,
                    payload: { userData: body },
                });
            res.cookie('accessToken', newAccessToken, {
                maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
            });
            res.cookie('refreshToken', newRefreshToken, {
                maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            });
            return res
                .status(200)
                .json({ message: 'Tokens refreshed successfully!' });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete('/users/delete')
    async deleteUser(@Res() res: Response, @Body() body: BaseUsersDto) {
        try {
            await this.usersService.delete(body);
            return res.status(200).json({
                message: 'User deleted successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
