import { BaseWorkspaceDto } from './base.dto';
import { IsBoolean, IsNumber } from 'class-validator';
import { IWorkspace } from '../workspace.interfaces';

export class DeleteWorkspaceDto extends BaseWorkspaceDto {
    @IsNumber()
    workspaceData: IWorkspace;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;
}
