import { Column, Task } from '@prisma/client';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

class EditTaskPayloadDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsNumber()
    @Min(1)
    assigneeId: number;

    description: string | null;

    attachmentImgPath: string | null;

    estimatedHours: number | null;

    estimatedMinutes: number | null;

    hoursSpent: number | null;

    minutesSpent: number | null;

    effort: number | null;

    priority: number | null;
}

export class ModifyTaskDto {
    taskData: Task;
    columnData: Column;
    boardData: IBoard;
    workspaceData: IWorkspace;
    payload: EditTaskPayloadDto;
}
