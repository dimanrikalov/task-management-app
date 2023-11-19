import { Column } from '@prisma/client';
import { BaseColumnsDto } from './base.dto';
import { IsArray, IsNumber, IsObject } from 'class-validator';

interface IColumnsPositions {
    columnId: number;
    newPosition: number;
}

export class MoveColumnDto extends BaseColumnsDto {
    @IsArray()
    columnsPositions: IColumnsPositions[];

    @IsObject()
    columnData: Column;
}
