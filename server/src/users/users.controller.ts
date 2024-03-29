import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName,
	generateWorkspaceRoomName
} from 'src/socket/socket.gateway';
import * as fs from 'fs';
import { Response } from 'express';
import { BaseUsersDto } from './dtos/base.dto';
import { UsersService } from './users.service';
import { FindUserDto } from './dtos/findUser.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { extractJWTData } from 'src/jwt/extractJWTData';
import { RefreshTokensDto } from './dtos/refreshTokens.dto';
import { Get, Put, Res, Post, Body, Delete, Controller } from '@nestjs/common';

@Controller('')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly socketGateway: SocketGateway
	) {}

	@Get('/user')
	async getUser(@Res() res: Response, @Body() body: BaseUsersDto) {
		try {
			const userData = await this.usersService.getUserById(
				body.userData.id
			);

			const imageBuffer = fs.readFileSync(userData.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			return res
				.status(200)
				.json({ ...userData, profileImg: imageBinary });
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Get('/users')
	async getAllUsers(@Res() res: Response) {
		try {
			const users = await this.usersService.getAllUsers();
			res.status(200).json(users);
		} catch (err: any) {
			console.log(err.message);
			res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post('/users')
	async getUsers(@Res() res: Response, @Body() body: FindUserDto) {
		try {
			const users = await this.usersService.getAllOtherUsers(body);
			res.status(200).json(users);
		} catch (err: any) {
			console.log(err.message);
			res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Get('/users/stats')
	async getUserStatsById(
		@Res() res: Response,
		@Body() { userData }: BaseUsersDto
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
			const { accessToken, refreshToken } =
				await this.usersService.signIn(res, userBody);
			return res.status(200).json({
				accessToken,
				refreshToken,
				message: 'Signed-up successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Post('/users/sign-in')
	async loginUser(@Res() res: Response, @Body() userBody: LoginUserDto) {
		try {
			const { accessToken, refreshToken } =
				await this.usersService.signIn(res, userBody);
			res.status(200).json({
				accessToken,
				refreshToken,
				message: 'Signed-in successfully!'
			});
		} catch (err: any) {
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/users/edit')
	async updateUser(@Res() res: Response, @Body() userBody: EditUserDto) {
		try {
			await this.usersService.update(userBody);
			return res.json({
				message: 'User credentials updated successfully!'
			});
		} catch (err: any) {
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post('/users/refresh')
	async refreshUserTokens(
		@Body() body: RefreshTokensDto,
		@Res() res: Response
	) {
		const refreshToken = body.refreshToken;
		try {
			const body = extractJWTData(refreshToken);

			const { newAccessToken, newRefreshToken } =
				this.usersService.refreshTokens({
					refreshToken,
					payload: { userData: body }
				});

			return res.status(200).json({
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
				message: 'Tokens refreshed successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Delete('/users/delete')
	async deleteUser(@Res() res: Response, @Body() body: BaseUsersDto) {
		try {
			const { affectedUserIds, affectedWorkspaceIds, affectedBoardIds } =
				await this.usersService.delete(body);

			//create temp room and add users to it
			const tempRoomName = `user-${body.userData.id}-deletion-affected-users`;
			await Promise.all(
				affectedUserIds.map(async (userId) => {
					await this.socketGateway.addToRoom(
						userId.toString(),
						tempRoomName
					);
				})
			);

			//emit event
			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.USER_DELETED);

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has deleted their
					 profile and all of their workspaces and boards respectively.`
				});

			//delete temp room
			this.socketGateway.clearRoom(tempRoomName);

			//emit to user colleagues from other boards and workspaces
			affectedWorkspaceIds.forEach((workspaceId) => {
				const workspaceRoomName =
					generateWorkspaceRoomName(workspaceId);
				this.socketGateway.server
					.to(workspaceRoomName)
					.emit(EVENTS.USER_DELETED);
			});

			affectedBoardIds.forEach((boardId) => {
				const boardRoomName = generateBoardRoomName(boardId);
				this.socketGateway.server
					.to(boardRoomName)
					.emit(EVENTS.USER_DELETED);
			});

			return res.status(200).json({
				message: 'User deleted successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}
}
