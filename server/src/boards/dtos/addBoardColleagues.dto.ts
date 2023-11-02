import { ArrayNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';

export class AddBoardColleaguesDto {
    @IsNumber()
    boardId: number;

    @ArrayNotEmpty()
    @IsArrayOfNumbers()
    colleagues: number[];
}
