import { IBoard } from '../boards.interfaces';
import { IUser } from 'src/users/users.interfaces';

export class GetBoardColleaguesDto {
	userData: IUser;
	boardData: IBoard;
}
