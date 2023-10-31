import { CreateWorkspaceDto } from "src/workspaces/dtos/create-workspace.dto";

export interface ICreateWorkspace extends CreateWorkspaceDto {
    authorization_token: string
}