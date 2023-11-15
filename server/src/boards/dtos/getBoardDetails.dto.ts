import { BaseBoardsDto } from './base.dto';
import { IBoard } from '../boards.interfaces';

export class GetBoardDetails extends BaseBoardsDto {
    boardData: IBoard;
}
