import { Task } from '@prisma/client';
import { BaseTasksDto } from './base.dto';
import { IsNumber, IsObject } from 'class-validator';
import { IBoard } from 'src/boards/boards.interfaces';

export class MoveTaskDto {
	@IsObject()
	taskData: Task;

	@IsObject()
	boardData: IBoard;

	@IsNumber()
	destinationPosition: number;

	@IsNumber()
	destinationColumnId: number;
}

export class MoveTaskDtoRich extends BaseTasksDto {
	@IsObject()
	taskData: Task;

	@IsObject()
	boardData: IBoard;

	@IsNumber()
	destinationPosition: number;

	@IsNumber()
	destinationColumnId: number;
}
