import { UsersService } from './users.service';
import { FindUserDto } from './dtos/findUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { DeleteUserDto } from './dtos/deleteUser.dto';
import { Get, Post, Body, Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get('/')
    async getUsers() {
        return this.usersService.findAll();
    }

    @Post('/sign-up')
    async createUser(@Body() userBody: CreateUserDto): Promise<string> {
        return await this.usersService.signUp(userBody);
    }

    @Post('/sign-in')
    async loginUser(@Body() userBody: FindUserDto): Promise<string> {
        return await this.usersService.signIn(userBody);
    }

    @Post('/delete')
    async deleteUser(@Body() tokenBody: DeleteUserDto): Promise<void>{
        return await this.usersService.delete(tokenBody);
    }
}
