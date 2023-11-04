import { BaseBoardsDto } from './base.dto';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';
import { Length, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBoardDto extends BaseBoardsDto {
    @IsNotEmpty()
    @Length(2, 128)
    name: string;

    @IsOptional()
    @IsArrayOfNumbers()
    colleagues: number[];
}
