import { Column } from '@prisma/client';
import { BaseColumnsDto } from './base.dto';
import { IsNumber, IsObject } from 'class-validator';

export class DeleteColumnDto extends BaseColumnsDto {
	@IsObject()
	columnData: Column;
}
