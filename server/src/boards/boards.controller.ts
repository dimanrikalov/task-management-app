import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName,
	generateWorkspaceRoomName
} from 'src/socket/socket.gateway';
import { Response } from 'express';
import { BoardsService } from './boards.service';
import { BaseUsersDto } from 'src/users/dtos/base.dto';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { DeleteBoardDto } from './dtos/deleteboard.dto';
import { RenameBoardDto } from './dtos/renameBoard.dto';
import { GetBoardDetails } from './dtos/getBoardDetails.dto';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';
import { GetBoardColleaguesDto } from './dtos/getBoardColleagues.dto';
import { Res, Get, Body, Post, Delete, Controller, Put } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
	constructor(
		private readonly socketGateway: SocketGateway,
		private readonly boardsService: BoardsService
	) {}

	@Get()
	async getUserBoards(@Res() res: Response, @Body() body: BaseUsersDto) {
		try {
			const boards = await this.boardsService.getUserBoards(body);
			return res.status(200).json(boards);
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post()
	async create(@Res() res: Response, @Body() body: CreateBoardDto) {
		try {
			const newBoard = await this.boardsService.create(body);

			const boardRoomName = generateBoardRoomName(newBoard.id);
			const workspaceRoomName = generateWorkspaceRoomName(
				body.workspaceData.id
			);

			const boardColleagues = body.colleagues.map(String);

			// filter out the user that creates the board
			const workspaceRoomMembers = this.socketGateway
				.getRoomMembers(workspaceRoomName)
				.filter((id) => id !== body.userData.id.toString());

			const usersToAdd = Array.from(
				new Set([...boardColleagues, ...workspaceRoomMembers])
			).filter((userId) => userId !== undefined);

			// add all users to the new board room
			await Promise.all(
				usersToAdd.map(async (userId) => {
					await this.socketGateway.addToRoom(
						userId.toString(),
						boardRoomName
					);
				})
			);

			//emit a notification to users with workspace and board access
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.BOARD_CREATED);

			//emit event that will notify them
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} 
					has created and added you to board "${body.name}".`
				});

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			return res.status(200).json({
				boardId: newBoard.id,
				message: 'Board created successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:boardId')
	async delete(@Res() res: Response, @Body() body: DeleteBoardDto) {
		try {
			await this.boardsService.delete(body);

			//board room already includes workspace users
			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//remove the user that deletes the board from the room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.BOARD_DELETED);

			//emit a notification to users with board and workspace access
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has deleted board 
					"${body.boardData.name}" inside workspace "${body.workspaceData.name}".`
				});

			//remove everyone inside that room
			this.socketGateway.clearRoom(boardRoomName);

			return res.status(200).json({
				message: 'Board deleted successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Get('/:boardId/details')
	async getBoardById(@Res() res: Response, @Body() body: GetBoardDetails) {
		try {
			const data = await this.boardsService.getBoardById(body);
			return res.status(200).json(data);
		} catch (err: any) {
			return res.status(400).json({ errorMessage: err.message });
		}
	}

	@Put('/:boardId/rename')
	async renameBoard(@Res() res: Response, @Body() body: RenameBoardDto) {
		try {
			await this.boardsService.rename(body);

			//board room already includes workspace users
			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.BOARD_RENAMED);

			//show notification
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has renamed
					board "${body.boardData.name}" to "${body.newName}".`
				});

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			return res.status(200).json({
				message: 'Board renamed successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Get('/:boardId/colleagues')
	async getColleagues(
		@Res() res: Response,
		@Body() body: GetBoardColleaguesDto
	) {
		try {
			const users = await this.boardsService.getBoardUsers(
				body.boardData
			);

			return res.status(200).json({
				users,
				message: 'Users fetched successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post('/:boardId/colleagues')
	async addColleague(
		@Res() res: Response,
		@Body() body: EditBoardColleagueDto
	) {
		try {
			const colleagueUsername =
				await this.boardsService.addColleague(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			//add new colleague BEFORE the events have been emitted
			await this.socketGateway.addToRoom(
				body.colleagueId.toString(),
				boardRoomName
			);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.BOARD_COLLEAGUE_ADDED);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has added
					 ${colleagueUsername} to board "${body.boardData.name}".`
				});

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			return res.status(200).json({
				message: 'Colleague added to board successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:boardId/colleagues')
	async removeColleague(
		@Res() res: Response,
		@Body() body: EditBoardColleagueDto
	) {
		try {
			const colleagueUsername =
				await this.boardsService.removeColleague(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.BOARD_COLLEAGUE_DELETED);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has removed
					 ${colleagueUsername} from board "${body.boardData.name}".`
				});

			//remove user from room AFTER they have received the notifications
			await this.socketGateway.removeFromRoom(
				body.colleagueId.toString(),
				boardRoomName
			);

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			return res.status(200).json({
				message: 'Colleague removed from board successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
