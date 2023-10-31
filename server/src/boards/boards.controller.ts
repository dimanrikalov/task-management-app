import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { Body, Headers, Get, Controller, Post } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Post()
    async createBoard(@Headers() headers, @Body() body: CreateBoardDto) {
        const authorizationToken = headers.authorization;
        return this.boardsService.create({ ...body, authorizationToken });
    }

    @Get()
    async getAllBoards() {}
}
