import { Response } from 'express';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    async create(@Res() res: Response, @Body() body: CreateMessageDto) {
        try {
            await this.messagesService.create(body);
            return res.status(200).json({
                message: 'Message sent.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
