import { AddBoardColleagueDto } from 'src/boards/dtos/addBoardColleague.dto';

export interface IAddBoardColleague extends AddBoardColleagueDto {
    authorizationToken: string;
}
