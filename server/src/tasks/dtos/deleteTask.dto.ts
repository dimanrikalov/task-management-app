import { BaseTasksDto } from './base.dto';
import { Step, Task } from '@prisma/client';

export class DeleteTasksDto extends BaseTasksDto {
	taskData: Task & { Step: Step[] };
}
