import {
    Max,
    Min,
    IsString,
    IsNumber,
    MinLength,
    IsOptional,
} from 'class-validator';
import { Column, Task } from '@prisma/client';
import { IStep } from 'src/steps/steps.service';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export interface IEditStep extends IStep {
    id: number;
}

class ModifyTaskPayloadDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsNumber()
    @Min(1)
    assigneeId: number;

    @IsOptional()
    @IsString()
    @MinLength(2)
    description: string | null;

    @IsOptional()
    @IsString()
    @MinLength(2)
    attachmentImgPath: string | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedHours: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(59)
    estimatedMinutes: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    hoursSpent: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(59)
    minutesSpent: number | null;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    effort: number | null;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(3)
    priority: number | null;

    @IsOptional()
    steps: IEditStep[];
}

export class ModifyTaskDto {
    taskData: Task;
    columnData: Column;
    boardData: IBoard;
    workspaceData: IWorkspace;
    payload: ModifyTaskPayloadDto;
}
