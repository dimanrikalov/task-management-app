import { BaseBoardsDto } from './base.dto';
import { IBoard } from '../boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class GetBoardDetails extends BaseBoardsDto {
    boardData: IBoard;
    workspaceData: IWorkspace;
    userHasAccessToBoard: boolean;
    userHasAccessToWorkspace: boolean;
}
