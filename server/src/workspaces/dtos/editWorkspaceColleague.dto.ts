import { BaseWorkspaceDto } from './base.dto';
import { IWorkspace } from '../workspace.interfaces';
import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export class EditWorkspaceColleagueDto extends BaseWorkspaceDto {
    @IsObject()
    workspaceData: IWorkspace;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;

    @IsNumber()
    colleagueId: number;
}
