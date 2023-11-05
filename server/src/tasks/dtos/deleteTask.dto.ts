import { Task } from '@prisma/client';
import { BaseTasksDto } from './base.dto';

export class DeleteTaskDto extends BaseTasksDto {
    taskData: Task;
}
