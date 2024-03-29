import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class MessagesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

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
						username: true,
						profileImagePath: true
					}
				}
			},
			orderBy: {
				timestamp: { sort: 'desc' }
			}
		});

		return messages.map((message) => {
			const imageBuffer = fs.readFileSync(message.User.profileImagePath);

			const imageBinary = Buffer.from(imageBuffer).toString('base64');

			const data = {
				...message,
				profileImgPath: imageBinary,
				username: message.User.username
			};

			delete data.User;
			return data;
		});
	}

	async create(body: CreateMessageDto) {
		const message = await this.prismaService.message.create({
			data: {
				content: body.content,
				boardId: body.boardData.id,
				writtenBy: body.userData.id,
				timestamp: new Date(Date.now())
			}
		});

		await Promise.all(
			body.taggedUsers.map(async (userId) => {
				await this.notificationsService.addNotification({
					userId,
					message: `${body.userData.username} has tagged you inside board "${body.boardData.name}".`
				});
			})
		);
		return message;
	}

	async deleteAll(boardId: number) {
		await this.prismaService.message.deleteMany({
			where: {
				boardId
			}
		});
	}
}
