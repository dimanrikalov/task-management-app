import { IsNumber } from 'class-validator';

export class DeleteStepDto {
    @IsNumber()
    stepId: number;
}
