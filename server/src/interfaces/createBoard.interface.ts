import { CreateBoardDto } from "src/boards/dtos/createBoard.dto";

export interface ICreateBoard extends CreateBoardDto {
    authorizationToken: string
}