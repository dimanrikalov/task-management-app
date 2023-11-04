import { Response } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { EditBoardColleagueDto } from './dtos/editBoardColleague.dto';
import { Body, Put, Controller, Post, Res, Delete } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    //apply ONLY the workspaceAuth.middleware to this endpoint
    @Post()
    async createBoard(@Res() res: Response, @Body() body: CreateBoardDto) {
        try {
            return this.boardsService.create(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    //apply ONLY the boardAuth.middleware to this endpoint
    @Put('colleagues/add')
    async addColleague(
        @Res() res: Response,
        @Body() body: EditBoardColleagueDto,
    ) {
        try {
            return this.boardsService.addColleague(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('colleagues/remove')
    async removeColleague(
        @Res() res: Response,
        @Body() body: EditBoardColleagueDto,
    ) {
        try {
            return this.boardsService.removeColleague(body);
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
}
