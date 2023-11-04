import { addColleaguesDto } from "src/workspaces/dtos/addColleagues.dto";

export interface IAddColleagues extends addColleaguesDto {
    authorizationToken: string;
}