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
            await this.usersService.signIn(res, userBody);
            return res.status(200).json({ message: 'Signed-up successfully!' });
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
            await this.usersService.signIn(res, userBody);
            res.status(200).json({ message: 'Signed-in successfully!' });
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
    async refreshUserTokens(
        @Req() req: Request,
        @Body() body: BaseUsersDto,
        @Res() res: Response,
    ) {
        try {
            const refreshToken = req.cookies['refreshToken'];
            const { newAccessToken, newRefreshToken } =
                this.usersService.refreshTokens({
                    payload: body,
                    refreshToken,
                });
            res.cookie('accessToken', newAccessToken);
            res.cookie('refreshToken', newRefreshToken);
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

    @Delete('/delete')
    async deleteUser(@Res() res: Response, @Body() body: BaseUsersDto) {
        try {
            await this.workspacesService.deleteMany(body.userData.id);
            await this.usersService.delete(body.userData.id);
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
