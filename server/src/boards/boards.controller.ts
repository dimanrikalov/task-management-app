import { Response } from 'express';
import { BoardsService } from './boards.service';
import { BaseUsersDto } from 'src/users/dtos/base.dto';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { DeleteBoardDto } from './dtos/deleteboard.dto';
import { GetBoardDetails } from './dtos/getBoardDetails.dto';
import { ReorderColumnsDto } from './dtos/reorderColumns.dto';
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
                errorMessage: err.message,
            });
        }
    }

    @Post()
    async create(@Res() res: Response, @Body() body: CreateBoardDto) {
        try {
            await this.boardsService.create(body);
            return res.status(200).json({
                message: 'Board created successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async delete(@Res() res: Response, @Body() body: DeleteBoardDto) {
        try {
            await this.boardsService.delete(body);
            return res.status(200).json({
                message: 'Board deleted successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Get('/details')
    async getBoardById(@Res() res: Response, @Body() body: GetBoardDetails) {
        try {
            const data = await this.boardsService.getBoardById(body);
            return res.status(200).json(data);
        } catch (err: any) {
            return res.status(400).json({ errorMessage: err.message });
        }
    }

    @Post('/colleagues')
    async addColleague(
        @Res() res: Response,
        @Body() body: EditBoardColleagueDto,
    ) {
        try {
            await this.boardsService.addColleague(body);
            return res.status(200).json({
                message: 'Colleague added to board successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete('/colleagues')
    async removeColleague(
        @Res() res: Response,
        @Body() body: EditBoardColleagueDto,
    ) {
        try {
            await this.boardsService.removeColleague(body);
            return res.status(200).json({
                message: 'Colleague removed from board successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/reorder')
    async reorderBoardColumns(
        @Res() res: Response,
        @Body() body: ReorderColumnsDto,
    ) {
        try {
            //check if all columns exist and are part of board
            await this.boardsService.reorderBoardColumns(body);
            return res.status(200).json({
                message: 'Columns reordered successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(401).json({
                errorMessage: err.message,
            });
        }
    }
}
