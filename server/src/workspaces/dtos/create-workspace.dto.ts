import { IsNotEmpty, IsAlphanumeric, Length } from 'class-validator';
import { IsArrayOfNumbers } from 'src/validators/IsArrayOfNumbers';

export class CreateWorkspaceDto {
    @IsNotEmpty()
    @Length(4,)
    name: string;

    @IsArrayOfNumbers()
    colleagues?: number[];
}