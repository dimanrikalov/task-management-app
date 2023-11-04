import { EditWorkspaceColleagueDto } from "src/workspaces/dtos/editWorkspaceColleague.dto";

export interface IAddColleagues extends EditWorkspaceColleagueDto {
    authorizationToken: string;
}