import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { IBoard } from 'src/boards/boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseColumnsDto {
    boardData: IBoard;
    userData: IJWTPayload;
    workspaceData: IWorkspace;
}
