import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseBoardsDto {
	userData: IJWTPayload;
	workspaceData: IWorkspace;
}
