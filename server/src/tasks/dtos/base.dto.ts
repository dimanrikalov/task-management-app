import { Column } from '@prisma/client';
import { IUser } from 'src/users/users.interfaces';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseTasksDto {
	userData: IUser;
	boardData: IBoard;
	columnData: Column;
	workspaceData: IWorkspace;
}
