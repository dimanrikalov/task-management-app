import { IUser } from 'src/users/users.interfaces';
import { IBoard } from 'src/boards/boards.interfaces';
import { IsBoolean, IsObject } from 'class-validator';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseColumnsDto {
	@IsObject()
	userData: IUser;

	@IsObject()
	boardData: IBoard;

	@IsObject()
	workspaceData: IWorkspace;

	@IsBoolean()
	userIsWorkspaceOwner: boolean;

	@IsBoolean()
	userHasAccessToBoard: boolean;

	@IsBoolean()
	userHasAccessToWorkspace: boolean;
}
