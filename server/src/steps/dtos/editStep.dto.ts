import { Step, Task } from '@prisma/client';
import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export class EditStepDto {
    @IsObject()
    taskData: Task;

    @IsObject()
    stepData: Step;

    @IsNumber()
    stepId: number;

    @IsBoolean()
    isComplete: boolean;
}
