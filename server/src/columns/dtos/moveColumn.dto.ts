import { IsArray, IsNumber, Min } from 'class-validator';
import { BaseColumnsDto } from './base.dto';

interface IColumnsPositions {
    columnId: number;
    newPosition: number;
}

export class MoveColumnDto extends BaseColumnsDto {
    @IsArray()
    columnsPositions: IColumnsPositions[];
}
