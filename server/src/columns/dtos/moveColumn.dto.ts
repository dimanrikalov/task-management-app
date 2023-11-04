import { IsNumber } from 'class-validator';
import { BaseColumnsDto } from './base.dto';

export class MoveColumnDto extends BaseColumnsDto {
    @IsNumber()
    columnId: number;

    @IsNumber()
    newPosition: number;
}
