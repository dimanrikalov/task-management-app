import { CreateBoardDto } from "src/boards/dtos/createBoard.dto";

export interface IBoard {
    id: number;
    name: string;
    ownerId: number;
    workspaceId: number;
}

// export interface IAddBoardColleague extends AddBoardColleagueDto {
//     authorizationToken: string;
// }


export interface ICreateBoard extends CreateBoardDto {
    authorizationToken: string
}