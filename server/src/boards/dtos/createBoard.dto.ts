import { BaseBoardsDto } from './base.dto';
import { IsArrayofType } from 'src/validators/IsArrayOfType';
import { Length, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBoardDto extends BaseBoardsDto {
    @IsNotEmpty()
    @Length(2, 128)
    name: string;

    @IsOptional()
    @IsArrayofType(String)
    colleagues: number[];
}
