import {
	Put,
	Res,
	Post,
	Body,
	Param,
	Delete,
	Headers,
	Controller,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName
} from 'src/socket/socket.gateway';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import { TasksService } from './tasks.service';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { MoveTaskDtoRich } from './dtos/moveTask.dto';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { CompleteTaskDto } from './dtos/completeTask.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateJWTToken } from 'src/jwt/validateJWTToken';
import { UploadTaskImgDto } from './dtos/uploadTaskImg.dto';

@Controller('tasks')
export class TasksController {
	constructor(
		private readonly tasksService: TasksService,
		private readonly socketGateway: SocketGateway
	) {}

	@Post()
	async create(@Res() res: Response, @Body() body: CreateTaskDto) {
		try {
			const task = await this.tasksService.create(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			// Create a temporary room
			const tempRoom = `temp-creation-room-${body.userData.id}`;

			// Add user ID to the temporary room
			this.socketGateway.addToRoom(body.userData.id.toString(), tempRoom);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.TASK_CREATED);

			if (body.userData.id !== body.assigneeId) {
				const clientEntry = this.socketGateway.clients[body.assigneeId];

				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has assigned you
						 to task - "${body.title}" inside board "${body.boardData.name}".`
				});
			}

			// Leave the temporary room after emitting events
			this.socketGateway.server.in(tempRoom).socketsLeave(tempRoom);

			return res.status(200).json({
				task,
				message: 'Task created successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/move')
	async move(@Res() res: Response, @Body() body: MoveTaskDtoRich) {
		try {
			await this.tasksService.move(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			// Create a temporary room
			const tempRoom = `temp-task-move-room-${body.userData.id}`;

			// Add user ID to the temporary room
			this.socketGateway.addToRoom(body.userData.id.toString(), tempRoom);

			// Emit TASK_MOVED event to all clients in the board room except the temp room
			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.TASK_MOVED);

			if (body.userData.id !== body.taskData.assigneeId) {
				const clientEntry =
					this.socketGateway.clients[body.taskData.assigneeId];

				// Create notification entry
				await this.tasksService.sendNotification(
					body.taskData.assigneeId,
					`${body.userData.username} has moved task -
					 "${body.taskData.title}" inside board "${body.boardData.name}".`
				);

				// Inform the user socket that is affected
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has moved task - "${body.taskData.title}"
						 which was assigned to you inside board "${body.boardData.name}".`
				});
			}

			// Leave the temporary room after emitting events
			this.socketGateway.server.in(tempRoom).socketsLeave(tempRoom);

			return res.status(200).json({
				message: 'Task moved successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/:taskId')
	async edit(@Res() res: Response, @Body() body: ModifyTaskDto) {
		try {
			const { task, userIdsToNotify } =
				await this.tasksService.edit(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			// Create a temporary room
			const tempRoom = `temp-task-modification-room-${body.userData.id}`;

			// Add user ID to the temporary room
			this.socketGateway.addToRoom(body.userData.id.toString(), tempRoom);

			// Emit TASK_MOVED event to all clients in the board room except the temp room
			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.TASK_MODIFIED);

			userIdsToNotify.forEach(({ userId, message }) => {
				const clientEntry = this.socketGateway.clients[userId];
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, { message });
			});

			// Leave the temporary room after emitting events
			this.socketGateway.server.in(tempRoom).socketsLeave(tempRoom);

			return res.status(200).json({
				task,
				message: 'Task modified successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/:taskId/complete')
	async complete(@Res() res: Response, @Body() body: CompleteTaskDto) {
		try {
			const task = await this.tasksService.complete(body);

			if (body.userData.id !== body.taskData.assigneeId) {
				const clientEntry =
					this.socketGateway.clients[body.taskData.assigneeId];
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has marked task
				 		 "${body.taskData.title}" that was assigned to you as complete.`
				});
			}

			return res.status(200).json({
				task,
				message: 'Task completed successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Put('/:taskId/upload-image')
	@UseInterceptors(FileInterceptor('taskImg'))
	async uploadTaskImage(
		@Res() res: Response,
		@Headers() headers: any,
		@UploadedFile() file: any,
		@Param('taskId') taskId: string
	) {
		try {
			const token = headers.authorization.split(' ')[1];
			if (!token || !validateJWTToken(token)) {
				throw new Error('Unauthorized access!');
			}

			const task = await this.tasksService.getById(Number(taskId));

			//check if user has access to the board
			const { board, user } =
				await this.tasksService.validateUserAccessToBoard({
					task,
					token
				});

			const uploadDir = process.env.TASK_IMGS_URL;

			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const fileName = `task-img-${uuid()}`;
			const filePath = join(uploadDir, fileName);

			fs.writeFileSync(filePath, file.buffer);

			const body: UploadTaskImgDto = {
				task,
				token,
				taskImagePath: filePath
			};

			const boardRoomName = generateBoardRoomName(board.id);

			// Create a temporary room
			const tempRoom = `temp-task-image-upload-room-${user.id}`;

			// Add user ID to the temporary room
			this.socketGateway.addToRoom(user.id.toString(), tempRoom);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.TASK_MODIFIED);

			await this.tasksService.uploadTaskImg(body);

			// Leave the temporary room after emitting events
			this.socketGateway.server.in(tempRoom).socketsLeave(tempRoom);

			return res.status(200).json({
				message: 'Task image updated successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}

	@Delete('/:taskId')
	async delete(@Res() res: Response, @Body() body: DeleteTasksDto) {
		try {
			await this.tasksService.delete(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			// Create a temporary room
			const tempRoom = `temp-task-deletion-room-${body.userData.id}`;

			// Add user ID to the temporary room
			this.socketGateway.addToRoom(body.userData.id.toString(), tempRoom);

			this.socketGateway.server
				.to(boardRoomName)
				.except(tempRoom)
				.emit(EVENTS.TASK_DELETED);

			if (body.userData.id !== body.taskData.assigneeId) {
				const clientEntry =
					this.socketGateway.clients[body.taskData.assigneeId];
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has deleted task
							  "${body.taskData.title}" that was assigned to you.`
				});
			}

			// Leave the temporary room after emitting events
			this.socketGateway.server.in(tempRoom).socketsLeave(tempRoom);

			return res.status(200).json({
				message: 'Task deleted successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
