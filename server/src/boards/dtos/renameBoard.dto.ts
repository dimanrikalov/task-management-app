import { IBoard } from '../boards.interfaces';
import { BaseBoardsDto } from './base.dto';
import { IsObject, IsString, Length, MinLength } from 'class-validator';

export class RenameBoardDto extends BaseBoardsDto {
    @IsString({ message: 'New board name must be a string!' })
    @Length(2, 128, {
        message: 'Board name must be in range 2-128 characters long.',
    })
    newName: string;

    @IsObject()
    boardData: IBoard;
}
