import { BaseWorkspaceDto } from './base.dto';
import { IWorkspace } from '../workspace.interfaces';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class RenameWorkspaceDto extends BaseWorkspaceDto {
    @IsString()
    @IsNotEmpty({ message: 'New name is required!' })
    newName: string;

    @IsObject()
    workspaceData: IWorkspace;

    @IsBoolean()
    userIsWorkspaceOwner: boolean;
}
