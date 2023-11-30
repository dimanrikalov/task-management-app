import { Response } from 'express';
import { MessagesService } from './messages.service';
import { IBoard } from 'src/boards/boards.interfaces';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';

@Controller('boards')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get('/:boardId/messages')
    async getBoardMessages(@Res() res: Response, @Body() body: IBoard) {
        try {
            const messages = await this.messagesService.getAllByBoardId(
                body.id,
            );
            return res.status(200).json(messages);
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Post('/:boardId/messages')
    async create(@Res() res: Response, @Body() body: CreateMessageDto) {
        try {
            await this.messagesService.create(body);
            return res.status(200).json({
                message: 'Message sent successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
