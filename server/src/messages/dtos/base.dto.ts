import { IBoard } from 'src/boards/boards.interfaces';
import { IJWTPayload } from 'src/jwt/jwt.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseMessagesDto {
    userData: IJWTPayload;
    workspaceData: IWorkspace;
    boardData: IBoard;
}
