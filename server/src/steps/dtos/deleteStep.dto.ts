import { Task } from '@prisma/client';
import { IsNumber, IsObject } from 'class-validator';

export class DeleteStepDto {
    @IsNumber()
    stepId: number;

    @IsObject()
    taskData: Task;
}
