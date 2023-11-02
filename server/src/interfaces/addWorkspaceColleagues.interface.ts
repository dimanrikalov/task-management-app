import { AddWorkspaceColleaguesDto } from "src/workspaces/dtos/addWorkspaceColleagues.dto";

export interface IAddWorkspaceColleagues extends AddWorkspaceColleaguesDto {
    authorizationToken: string;
}
