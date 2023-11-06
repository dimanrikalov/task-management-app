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
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly workspacesService: WorkspacesService,
    ) {}
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

    @Put('/edit')
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

    @Post('/refresh')
    async refreshUserToken(@Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies['refreshToken'];
            const accessToken = this.usersService.refreshToken(refreshToken);
            return res.status(200).json({ accessToken });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete('/delete')
    async deleteUser(@Res() res: Response, @Body() body: BaseUsersDto) {
        try {
            await this.workspacesService.deleteMany(body.userData.id);
            await this.usersService.delete(body.userData.id);
            return res.status(200).json({
                message: 'User deleted successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
