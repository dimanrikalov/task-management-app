import { Task } from '@prisma/client';
import { BaseTasksDto } from './base.dto';

export class DeleteTasksDto extends BaseTasksDto {
    taskData: Task;
}
