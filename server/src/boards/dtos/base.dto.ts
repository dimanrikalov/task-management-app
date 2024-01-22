import { IUser } from 'src/users/users.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseBoardsDto {
	userData: IUser;
	workspaceData: IWorkspace;
}
