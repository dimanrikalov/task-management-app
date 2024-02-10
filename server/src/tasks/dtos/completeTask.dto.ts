import { Task } from "@prisma/client";
import { BaseTasksDto } from "./base.dto";

export class CompleteTaskDto extends BaseTasksDto {
    taskData: Task;
}