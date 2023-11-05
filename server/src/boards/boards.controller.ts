import { Response } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { Body, Controller, Post, Res, Delete } from '@nestjs/common';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    //apply ONLY the workspaceAuth.middleware to this endpoint
    @Post()
    async createBoard(@Res() res: Response, @Body() body: CreateBoardDto) {
        try {
            await this.boardsService.create(body);
            return res.status(200).json({
                message: 'Board created successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async deleteBoard(@Res() res: Response, @Body() body) {
        //To Do
    }

    //apply ONLY the boardAuth.middleware to this endpoint
    @Post('/colleagues')
    async addColleague(
        @Res() res: Response,
        @Body() body: EditBoardColleagueDto,
    ) {
        try {
            await this.boardsService.addColleague(body);
            return res.status(200).json({
                message: 'Colleague added to board successfully.',
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
                message: 'Colleague removed from board successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
