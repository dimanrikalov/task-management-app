import { BaseBoardsDto } from './base.dto';
import { IsArrayOfType } from 'src/validators/IsArrayOfType';
import { Length, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBoardDto extends BaseBoardsDto {
    @IsNotEmpty()
    @Length(2, 128)
    name: string;

    @IsOptional()
    @IsArrayOfType('number')
    colleagues: number[];
}
