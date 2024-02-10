import { BaseColumnsDto } from './base.dto';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateColumnDto extends BaseColumnsDto {
	@IsString()
	@MinLength(2)
	@MaxLength(128)
	name: string;
}
