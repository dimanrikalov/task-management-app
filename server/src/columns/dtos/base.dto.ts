import { IBoard } from 'src/boards/boards.interfaces';
import { IsBoolean, IsObject } from 'class-validator';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class BaseColumnsDto {
    @IsObject()
    boardData: IBoard;

    @IsObject()
    workspaceData: IWorkspace;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;

    @IsBoolean()
    userHasAccessToWorkspace: boolean;
}
