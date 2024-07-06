import {
	EVENTS,
	SocketGateway,
	generateBoardRoomName
} from 'src/socket/socket.gateway';
import { Response } from 'express';
import { TasksService } from './tasks.service';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { MoveTaskDtoRich } from './dtos/moveTask.dto';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { CompleteTaskDto } from './dtos/completeTask.dto';
import { Put, Res, Post, Body, Delete, Controller } from '@nestjs/common';

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

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.TASK_CREATED);

			if (body.userData.id !== body.assigneeId) {
				const clientEntry =
					this.socketGateway.clients[body.assigneeId.toString()];

				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has assigned you
						 to task - "${body.title}" inside board "${body.boardData.name}".`
				});
			}

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

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

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			// Emit TASK_MOVED event to all clients in the board room except the temp room
			this.socketGateway.server.to(boardRoomName).emit(EVENTS.TASK_MOVED);

			//Make sure to only notify assignee if they still have access to the board
			const roomMembers =
				this.socketGateway.getRoomMembers(boardRoomName);

			const isAssigneePartOfBoard = roomMembers.some(
				(userId) => userId === body.taskData.assigneeId.toString()
			);

			if (
				body.userData.id !== body.taskData.assigneeId &&
				isAssigneePartOfBoard
			) {
				const clientEntry =
					this.socketGateway.clients[
						body.taskData.assigneeId.toString()
					];

				// Create notification entry
				await this.tasksService.sendNotification(
					body.taskData.assigneeId,
					`${body.userData.username} премести задачата
					 "${body.taskData.title}" в дъската "${body.boardData.name}".`
					// `${body.userData.username} has moved task -
					//  "${body.taskData.title}" inside board "${body.boardData.name}".`
				);

				// Inform the user socket that is affected
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has moved task - "${body.taskData.title}"
						 which was assigned to you inside board "${body.boardData.name}".`
				});
			}

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

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

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);

			// Emit TASK_MOVED event to all clients in the board room except the temp room
			this.socketGateway.server
				.to(boardRoomName)

				.emit(EVENTS.TASK_MODIFIED);

			userIdsToNotify.forEach(({ userId, message }) => {
				const clientEntry =
					this.socketGateway.clients[userId.toString()];
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, { message });
			});

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);

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

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//Make sure to only notify assignee if they still have access to the board
			const roomMembers =
				this.socketGateway.getRoomMembers(boardRoomName);

			const isAssigneePartOfBoard = roomMembers.some(
				(userId) => userId === body.taskData.assigneeId.toString()
			);

			if (
				body.userData.id !== body.taskData.assigneeId &&
				isAssigneePartOfBoard
			) {
				const clientEntry =
					this.socketGateway.clients[
						body.taskData.assigneeId.toString()
					];
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

	@Delete('/:taskId')
	async delete(@Res() res: Response, @Body() body: DeleteTasksDto) {
		try {
			await this.tasksService.delete(body);

			const boardRoomName = generateBoardRoomName(body.boardData.id);

			//temporary remove the current user from the board room
			await this.socketGateway.removeFromRoom(
				body.userData.id.toString(),
				boardRoomName
			);
			this.socketGateway.server
				.to(boardRoomName)
				.emit(EVENTS.TASK_DELETED);

			//Make sure to only notify assignee if they still have access to the board
			const roomMembers =
				this.socketGateway.getRoomMembers(boardRoomName);

			const isAssigneePartOfBoard = roomMembers.some(
				(userId) => userId === body.taskData.assigneeId.toString()
			);

			if (
				body.userData.id !== body.taskData.assigneeId &&
				isAssigneePartOfBoard
			) {
				const clientEntry =
					this.socketGateway.clients[
						body.taskData.assigneeId.toString()
					];
				clientEntry?.socket.emit(EVENTS.NOTIFICATION, {
					message: `${body.userData.username} has deleted task
							  "${body.taskData.title}" that was assigned to you.`
				});
			}

			//add current user back to the room
			await this.socketGateway.addToRoom(
				body.userData.id.toString(),
				boardRoomName
			);
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
