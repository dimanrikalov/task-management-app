import { IsNumber } from 'class-validator';
import { BaseTasksDto } from './base.dto';

export class DeleteTaskDto extends BaseTasksDto {
    @IsNumber()
    taskId: number;
}
