import { IUser } from 'src/users/users.interfaces';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseMessagesDto {
	userData: IUser;
	boardData: IBoard;
	workspaceData: IWorkspace;
}
