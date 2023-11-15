import { Column, Task } from '@prisma/client';
import { IBoard } from 'src/boards/boards.interfaces';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

class EditTaskPayload {
    @IsString()
    @MinLength(2)
    title: string;

    @IsNumber()
    assigneeId: number;

    description: string;
    attachmentImgPath: string;
    estimatedHours: number;
    estimatedMinutes: number;
    hoursSpent: number;
    minutesSpent: number;
    effort: number;
    priority: number;
}

export class EditTaskDto {
    taskData: Task;
    columnData: Column;
    boardData: IBoard;
    workspaceData: IWorkspace;
    payload: EditTaskPayload;
}
