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
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import { TasksService } from './tasks.service';
import { MoveTaskDto } from './dtos/moveTask.dto';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { CompleteTaskDto } from './dtos/completeTask.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateJWTToken } from 'src/jwt/validateJWTToken';
import { UploadTaskImgDto } from './dtos/uploadTaskImg.dto';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Post()
	async create(@Res() res: Response, @Body() body: CreateTaskDto) {
		try {
			const task = await this.tasksService.create(body);
			return res.status(200).json({
				task,
				message: 'Task created successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Put('/move')
	async move(@Res() res: Response, @Body() body: MoveTaskDto) {
		try {
			await this.tasksService.move(body);
			return res.status(200).json({
				message: 'Task moved successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Put('/:taskId')
	async edit(@Res() res: Response, @Body() body: ModifyTaskDto) {
		try {
			const task = await this.tasksService.edit(body);
			return res.status(200).json({
				task,
				message: 'Task modified successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Put('/:taskId/complete')
	async complete(@Res() res: Response, @Body() body: CompleteTaskDto) {
		try {
			const task = await this.tasksService.complete(body);
			return res.status(200).json({
				task,
				message: 'Task completed successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
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
			await this.tasksService.validateUserAccessToBoard({ task, token });

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

			await this.tasksService.uploadTaskImg(body);
			return res.status(200).json({
				message: 'User image updated successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}

	@Delete('/:taskId')
	async delete(@Res() res: Response, @Body() body: DeleteTasksDto) {
		try {
			await this.tasksService.delete(body);
			return res.status(200).json({
				message: 'Task deleted successfully!'
			});
		} catch (err: any) {
			console.log(err.message);
			return res.status(400).json({
				errorMessage: err.message
			});
		}
	}
}
