import { Column } from '@prisma/client';
import { BaseColumnsDto } from './base.dto';

export class DeleteColumnDto extends BaseColumnsDto {
    columnData: Column;
}
