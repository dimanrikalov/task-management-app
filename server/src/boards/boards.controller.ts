import { Response } from 'express';
import { BoardsService } from './boards.service';
import { BaseUsersDto } from 'src/users/dtos/base.dto';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { DeleteBoardDto } from './dtos/deleteboard.dto';
import { RenameBoardDto } from './dtos/renameBoard.dto';
import { GetBoardDetails } from './dtos/getBoardDetails.dto';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';
import { Res, Get, Body, Post, Delete, Controller, Put } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) {}

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
			return res.status(200).json({
				boardId: newBoard.id,
				message: 'Board created successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Delete('/:boardId')
	async delete(@Res() res: Response, @Body() body: DeleteBoardDto) {
		try {
			await this.boardsService.delete(body);
			return res.status(200).json({
				message: 'Board deleted successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
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

	@Post('/:boardId/colleagues')
	async addColleague(
		@Res() res: Response,
		@Body() body: EditBoardColleagueDto
	) {
		try {
			await this.boardsService.addColleague(body);
			return res.status(200).json({
				message: 'Colleague added to board successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Delete('/:boardId/colleagues')
	async removeColleague(
		@Res() res: Response,
		@Body() body: EditBoardColleagueDto
	) {
		try {
			await this.boardsService.removeColleague(body);
			return res.status(200).json({
				message: 'Colleague removed from board successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}
}
