import { BaseBoardsDto } from './base.dto';
import { IBoard } from '../boards.interfaces';
import { IWorkspace } from 'src/workspaces/workspace.interfaces';
import { IsBoolean, IsNotEmptyObject, IsNumber } from 'class-validator';

export class EditBoardColleagueDto extends BaseBoardsDto {
	@IsNotEmptyObject()
	boardData: IBoard;

	@IsNumber()
	colleagueId: number;

	@IsNotEmptyObject()
	workspaceData: IWorkspace;

	@IsBoolean()
	userIsWorkspaceOwner: boolean;

	@IsBoolean()
	userHasAccessToWorkspace: boolean;
}
