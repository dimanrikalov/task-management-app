import { BaseWorkspaceDto } from './base.dto';
import { IWorkspace } from '../workspace.interfaces';
import { IsBoolean, IsObject } from 'class-validator';

export class DeleteWorkspaceDto extends BaseWorkspaceDto {
    @IsObject()
    workspaceData: IWorkspace;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;
}
