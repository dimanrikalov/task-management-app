import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dtos/createMessage.dto';

@Injectable()
export class MessagesService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(body: CreateMessageDto) {
        await this.prismaService.message.create({
            data: {
                content: body.content,
                boardId: body.boardData.id,
                writtenBy: body.userData.id,
                timestamp: new Date(Date.now()),
            },
        });
    }

    async deleteAll(boardId: number) {
        await this.prismaService.message.deleteMany({
            where: {
                boardId,
            },
        });
    }
}
