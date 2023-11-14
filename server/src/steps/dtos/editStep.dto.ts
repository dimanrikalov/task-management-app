import { IsNumber } from 'class-validator';
import { BaseStepsDto } from './base.dto';

export class EditStepDto extends BaseStepsDto {
    @IsNumber()
    stepId: number;
}
