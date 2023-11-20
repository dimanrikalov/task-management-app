import { Column, Task } from '@prisma/client';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

class EditTaskPayloadDto {
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
}

export class ModifyTaskDto {
    taskData: Task;
    columnData: Column;
    boardData: IBoard;
    workspaceData: IWorkspace;
    payload: EditTaskPayloadDto;
}
