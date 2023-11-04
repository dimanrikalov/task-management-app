import { IsNumber, IsString, MinLength } from 'class-validator';
import { BaseColumnsDto } from './base.dto';

export class RenameColumnDto extends BaseColumnsDto {
    @IsNumber()
    columnId: number;

    @IsString()
    @MinLength(2)
    newName: string;
}
