import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';

export class CreateWorkspaceDto {
    @IsNotEmpty()
    @Length(4, 128)
    name: string;

    @IsOptional()
    @IsArrayOfNumbers()
    colleagues: number[];
}