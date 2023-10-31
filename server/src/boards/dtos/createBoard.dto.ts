import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';
import { Length, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBoardDto {
    @IsNotEmpty()
    @Length(2, 128)
    name: string;

    @IsOptional()
    @IsNumber()
    workspaceId: number;

    @IsOptional()
    @IsArrayOfNumbers()
    colleagues: number[];
}
