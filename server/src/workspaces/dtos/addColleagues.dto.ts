import { IsNumber, MinLength } from 'class-validator';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';

export class addColleaguesDto {
    @IsNumber()
    workspaceId: number;

    @MinLength(1)
    @IsArrayOfNumbers()
    colleagues: number[];
}
