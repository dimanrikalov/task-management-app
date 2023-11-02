import { ArrayNotEmpty, IsNumber } from 'class-validator';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';

export class AddWorkspaceColleaguesDto {
    @IsNumber()
    workspaceId: number;

    @ArrayNotEmpty()
    @IsArrayOfNumbers()
    colleagues: number[];
}
