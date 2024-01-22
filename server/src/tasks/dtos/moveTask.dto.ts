import { Task } from '@prisma/client';
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
