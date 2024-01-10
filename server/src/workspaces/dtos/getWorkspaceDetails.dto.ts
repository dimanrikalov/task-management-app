import { BaseWorkspaceDto } from './base.dto';
import { IWorkspace } from '../workspace.interfaces';

export class GetWorkspaceDetails extends BaseWorkspaceDto {
	workspaceData: IWorkspace;
}
