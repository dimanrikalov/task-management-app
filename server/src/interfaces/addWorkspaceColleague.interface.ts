import { AddWorkspaceColleagueDto } from "src/workspaces/dtos/addWorkspaceColleague.dto";

export interface IAddWorkspaceColleague extends AddWorkspaceColleagueDto {
    authorizationToken: string;
}
