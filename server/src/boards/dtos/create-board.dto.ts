
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';
import { Length, IsNumber, IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class CreateBoardDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    name: string;

    @IsNotEmpty()
    @Length(60, 60)
    authorization_token: string;

    @IsNumber()
    workspace_id?: number;

    @IsArrayOfNumbers()
    colleagues?: number[];
}
