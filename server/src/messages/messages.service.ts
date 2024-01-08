import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dtos/createMessage.dto';

@Injectable()
export class MessagesService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllByBoardId(boardId: number) {
        const messages = await this.prismaService.message.findMany({
            where: {
                boardId
            },
            select: {
                id: true,
                content: true,
                timestamp: true,
                writtenBy: true,
                User: {
                    select: {
                        lastName: true,
                        firstName: true,
                        profileImagePath: true
                    }
                }
            },
            orderBy: {
                timestamp: { sort: 'asc' }
            }
        });

        return messages.map((message) => {
            const imageBuffer = fs.readFileSync(message.User.profileImagePath);

            const imageBinary = Buffer.from(imageBuffer).toString('base64');

            const data = {
                ...message,
                profileImgPath: imageBinary,
                lastName: message.User.lastName,
                firstName: message.User.firstName
            };

            delete data.User;
            return data;
        });
    }

    async create(body: CreateMessageDto) {
        await this.prismaService.message.create({
            data: {
                content: body.content,
                boardId: body.boardData.id,
                writtenBy: body.userData.id,
                timestamp: new Date(Date.now())
            }
        });
    }

    async deleteAll(boardId: number) {
        await this.prismaService.message.deleteMany({
            where: {
                boardId
            }
        });
    }
}
