import { Column } from '@prisma/client';
import { BaseColumnsDto } from './base.dto';
import { IsNumber, IsObject } from 'class-validator';
import { IBoard } from 'src/boards/boards.interfaces';

export class MoveColumnDto {
	@IsObject()
	columnData: Column;

	@IsObject()
	boardData: IBoard;

	@IsNumber()
	destinationPosition: number;
}

export class MoveColumnDtoRich extends BaseColumnsDto {
	@IsObject()
	columnData: Column;

	@IsNumber()
	destinationPosition: number;
}
