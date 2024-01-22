import { IsBoolean, IsString } from 'class-validator';

export class BaseStepsDto {
	@IsString()
	description: string;

	@IsBoolean()
	isComplete: boolean;
}
