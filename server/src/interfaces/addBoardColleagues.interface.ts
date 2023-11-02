import { AddBoardColleaguesDto } from 'src/boards/dtos/addBoardColleagues.dto';

export interface IAddBoardColleagues extends AddBoardColleaguesDto {
    authorizationToken: string;
}
