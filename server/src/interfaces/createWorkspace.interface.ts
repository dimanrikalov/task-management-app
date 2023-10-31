import { CreateWorkspaceDto } from "src/workspaces/dtos/createWorkspace.dto";

export interface ICreateWorkspace extends CreateWorkspaceDto {
    authorizationToken: string
}