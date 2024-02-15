import {
	Min,
	Max,
	IsArray,
	IsNumber,
	IsString,
	MinLength,
	MaxLength,
	IsOptional
} from 'class-validator';
import { BaseTasksDto } from './base.dto';
import { BaseStepsDto } from 'src/steps/dtos/base.dto';

export class CreateTaskDto extends BaseTasksDto {
	@IsNumber()
	@Min(1, { message: 'Assignee ID must be a positive number!' })
	assigneeId: number;

	@IsString()
	@MinLength(2, { message: 'Task name must be at least 2 characters long!' })
	@MaxLength(128, {
		message: 'Task name must be at most 128 characters long!'
	})
	title: string;

	@IsOptional()
	@IsString()
	@MaxLength(1024, {
		message: 'Maximum description length is 1024 characters.'
	})
	description?: string;

	@IsOptional()
	@IsString()
	attachmentImgPath?: string;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Estimated hours must not be negative!'
	})
	estimatedHours?: number;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Estimated minutes must not be negative!'
	})
	@Max(59, {
		message: 'Estimated minutes must not be greater than 59!'
	})
	estimatedMinutes?: number;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Hours spent must not be negative!'
	})
	hoursSpent?: number;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Minutes spent must not be negative!'
	})
	@Max(59, {
		message: 'Minutes spent must not be greater than 59!'
	})
	minutesSpent?: number;

	@IsOptional()
	@IsNumber()
	@Min(1, { message: 'Priority must be at least low!' })
	@Max(3, { message: 'Priority must be at most high!' })
	priority?: number;

	@IsOptional()
	@IsNumber()
	@Min(1, { message: 'Effort must a be positive number!' })
	@Max(5, { message: 'Maximum effort value is 5!' })
	effort?: number;

	@IsOptional()
	@IsArray()
	steps?: BaseStepsDto[];
}
