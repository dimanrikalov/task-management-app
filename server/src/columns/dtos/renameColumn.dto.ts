import { BaseColumnsDto } from './base.dto';
import { IsString, MinLength } from 'class-validator';

export class RenameColumnDto extends BaseColumnsDto {
    @IsString()
    @MinLength(2)
    newName: string;
}
