import { BaseWorkspaceDto } from './base.dto';
import { IWorkspace } from '../workspace.interfaces';
import { IsBoolean, IsNumber } from 'class-validator';

export class EditWorkspaceColleagueDto extends BaseWorkspaceDto {
    @IsNumber()
    workspaceData: IWorkspace;

    @IsBoolean()
    isUserWorkspaceOwner: boolean;

    @IsNumber()
    colleagueId: number;
}
