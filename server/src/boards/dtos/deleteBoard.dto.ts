import { BaseBoardsDto } from './base.dto';
import { IBoard } from '../boards.interfaces';

export class DeleteBoardDto extends BaseBoardsDto {
    boardData: IBoard;
}
