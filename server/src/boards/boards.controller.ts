import { BoardsService } from './boards.service';
import { Get, Controller, Post } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Post()
    async createBoard(body: CreateBoardDto) {
        //return this.boardsService.create(body);
    }

    @Get()
    async getAllBoards() {}
}
