import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName
} from 'src/socket/socket.gateway';
import { Response } from 'express';
import { ColumnsService } from './columns.service';
import { MoveColumnDtoRich } from './dtos/moveColumn.dto';
import { CreateColumnDto } from './dtos/createColumn.dto';
import { RenameColumnDto } from './dtos/renameColumn.dto';
import { DeleteColumnDto } from './dtos/deleteColumn.dto';
import { Body, Controller, Delete, Res, Post, Put } from '@nestjs/common';

@Controller('columns')
export class ColumnsController {
	constructor(
		private readonly socketGateway: SocketGateway,
		private readonly columnsService: ColumnsService
	) {}

	@Post()
	async create(@Res() res: Response, @Body() body: CreateColumnDto) {
		try {
			const columnId = await this.columnsService.create(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);
			// Create a temporary room
			const tempRoom = `temp-column-creation-room-${body.userData.id}`;

			// Add user ID to the temporary room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				tempRoom
			);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.COLUMN_CREATED);

			// Leave the temporary room after emitting events
			this.socketGateway.clearRoom(tempRoom);

			return res.status(200).json({
				columnId,
				message: 'New column added successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/move')
	async move(@Res() res: Response, @Body() body: MoveColumnDtoRich) {
		try {
			await this.columnsService.move(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);
			// Create a temporary room
			const tempRoom = `temp-move-room-${body.userData.id}`;

			// Add user ID to the temporary room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				tempRoom
			);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.COLUMN_MOVED);

			// Leave the temporary room after emitting events
			this.socketGateway.clearRoom(tempRoom);

			return res.status(200).json({
				message: 'Column moved successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/:columnId/rename')
	async rename(@Res() res: Response, @Body() body: RenameColumnDto) {
		try {
			await this.columnsService.rename(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);
			// Create a temporary room
			const tempRoom = `temp-rename-room-${body.userData.id}`;

			// Add user ID to the temporary room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				tempRoom
			);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.COLUMN_RENAMED);

			// Leave the temporary room after emitting events
			this.socketGateway.clearRoom(tempRoom);

			return res.status(200).json({
				message: 'Column renamed succesfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:columnId')
	async delete(@Res() res: Response, @Body() body: DeleteColumnDto) {
		try {
			const affectedUsers = await this.columnsService.delete(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);
			// Create a temporary room
			const tempRoom = `temp-delete-room-${body.userData.id}`;
			const affectedUsersRoom = `affected-users-room-${body.columnData.id}`;
			// Add user ID to the temporary room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				tempRoom
			);

			await Promise.all(
				affectedUsers.map(async (userId) => {
					await this.socketGateway.addToRoom(
						userId.toString(),
						affectedUsersRoom
					);
				})
			);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.COLUMN_DELETED);

			this.socketGateway.server
				.to(affectedUsersRoom)
				.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has deleted
					 a column that contains a task assigned to you.`
				});

			// Leave the temporary room after emitting events
			this.socketGateway.clearRoom(tempRoom);

			return res.status(200).json({
				message: 'Column deleted successfully!'
			});
		} catch (err: any) {
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
