import { Task } from '@prisma/client';
import { IsObject } from 'class-validator';

interface ICreateStepPayload {
    description: string;
    isComplete: boolean;
}

export class CreateStepDto {
    @IsObject()
    taskData: Task;

    @IsObject()
    payload: ICreateStepPayload;
}
