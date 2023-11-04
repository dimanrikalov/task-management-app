import { BaseWorkspaceDto } from './base.dto';
import { IsArrayofType } from 'src/validators/IsArrayOfType';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateWorkspaceDto extends BaseWorkspaceDto {
    @IsNotEmpty()
    @Length(4, 128)
    name: string;

    @IsOptional()
    @IsArrayofType(Number)
    colleagues: number[];
}
