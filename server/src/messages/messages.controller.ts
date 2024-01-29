import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName
} from 'src/socket/socket.gateway';
import { Response } from 'express';
import { BaseMessagesDto } from './dtos/base.dto';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';

@Controller('boards')
export class MessagesController {
	constructor(
		private readonly socketGateway: SocketGateway,
		private readonly messagesService: MessagesService
	) {}

	@Get('/:boardId/messages')
	async getBoardMessages(
		@Res() res: Response,
		@Body() body: BaseMessagesDto
	) {
		try {
			const messages = await this.messagesService.getAllByBoardId(
				body.boardData.id
			);
			return res.status(200).json(messages);
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}

	@Post('/:boardId/messages')
	async create(@Res() res: Response, @Body() body: CreateMessageDto) {
		try {
			const message = await this.messagesService.create(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);
			const tempRoomName = `message-${message.id}-tagged-users-temp-room`;
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.MESSAGE_SENT);

			//add to temp tagged room
			body.taggedUsers.forEach((taggedUser) => {
				this.socketGateway.addToRoom(
					taggedUser.toString(),
					tempRoomName
				);
			});

			this.socketGateway.server
				.to(tempRoomName)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has tagged
					 you inside board chat "${body.boardData.name}"`
				});

			return res.status(200).json({
				message: 'Message sent successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}
}
