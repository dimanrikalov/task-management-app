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
            return this.boardsService.create(body);
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
            return this.boardsService.addColleague(body);
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
            return this.boardsService.removeColleague(body);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
