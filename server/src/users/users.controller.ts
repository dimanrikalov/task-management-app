import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { DeleteUserDto } from './dtos/deleteUser.dto';
import { Get, Post, Body, Controller, Res, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get('/')
    async getUsers() {
        return this.usersService.getAll();
    }

    @Post('/sign-up')
    async createUser(@Res() res: Response, @Body() userBody: CreateUserDto) {
        try {
            await this.usersService.signUp(userBody);
            return await this.loginUser(res, userBody);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/sign-in')
    async loginUser(@Res() res: Response, @Body() userBody: LoginUserDto) {
        try {
            const response = await this.usersService.signIn(userBody);
            //set the refreshToken as a cookie
            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            });

            //set the accessToken as response
            return res.json({ accessToken: response.accessToken });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/refresh')
    async refreshUserToken(@Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies['refreshToken'];
            const response = this.usersService.refreshToken(refreshToken);
            return res.status(200).json(response);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/delete')
    async deleteUser(@Body() tokenBody: DeleteUserDto): Promise<void> {
        return await this.usersService.delete(tokenBody);
    }
}
