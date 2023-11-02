import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateColumnDto {
    @IsString()
    @MinLength(2)
    @MaxLength(128)
    name: string;

    @IsNumber()
    boardId: number;
}
