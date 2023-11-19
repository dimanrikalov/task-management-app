import { BaseBoardsDto } from './base.dto';
import { IBoard } from '../boards.interfaces';
import { IsBoolean, IsNotEmptyObject, IsNumber } from 'class-validator';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';

export class EditBoardColleagueDto extends BaseBoardsDto {
    @IsNotEmptyObject()
    boardData: IBoard;

    @IsNotEmptyObject()
    workspaceData: IWorkspace;

    @IsNumber()
    colleagueId: number;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;

    @IsBoolean()
    userHasAccessToWorkspace: boolean;
}
