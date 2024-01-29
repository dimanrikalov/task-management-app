import { Column } from '@prisma/client';
import { IsObject } from 'class-validator';
import { IUser } from 'src/users/users.interfaces';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseTasksDto {
	@IsObject()
	userData: IUser;

	@IsObject()
	boardData: IBoard;

	@IsObject()
	columnData: Column;

	@IsObject()
	workspaceData: IWorkspace;
}
