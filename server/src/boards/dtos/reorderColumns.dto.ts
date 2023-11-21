import { IsObject } from 'class-validator';
import { IBoard } from '../boards.interfaces';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';

export class ReorderColumnsDto {
    @IsObject()
    boardData: IBoard;

    @IsArrayOfType('number')
    columnsOrder: number[];
}
