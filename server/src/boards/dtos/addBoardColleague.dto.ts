import { IsNumber } from 'class-validator';

export class AddBoardColleagueDto {
    @IsNumber()
    boardId: number;

    @IsNumber()
    colleagueId: number;
}
