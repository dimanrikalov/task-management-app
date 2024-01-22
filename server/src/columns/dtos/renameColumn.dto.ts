import { Column } from '@prisma/client';
import { BaseColumnsDto } from './base.dto';
import { IsNumber, IsObject, IsString, MinLength } from 'class-validator';

export class RenameColumnDto extends BaseColumnsDto {
	@IsString()
	@MinLength(2)
	newName: string;

	@IsObject()
	columnData: Column;
}
