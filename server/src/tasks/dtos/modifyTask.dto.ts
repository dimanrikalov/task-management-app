import {
	Max,
	Min,
	IsString,
	IsNumber,
	MinLength,
	MaxLength,
	IsOptional,
	ValidateNested
} from 'class-validator';
import { Task } from '@prisma/client';
import { Type } from 'class-transformer';
import { BaseTasksDto } from './base.dto';
import { IStep } from 'src/steps/steps.service';

export interface IEditStep extends IStep {
	id: number;
}

class ModifyTaskPayloadDto {
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
	attachmentImg?: string;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Estimated hours must not be negative!'
	})
	estimatedHours: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Estimated minutes must not be negative!'
	})
	@Max(59, {
		message: 'Estimated minutes must not be greater than 59!'
	})
	estimatedMinutes: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Hours spent must not be negative!'
	})
	hoursSpent: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: 'Minutes spent must not be negative!'
	})
	@Max(59, {
		message: 'Minutes spent must not be greater than 59!'
	})
	minutesSpent: number | null;

	@IsOptional()
	@IsNumber()
	@Min(1, { message: 'Priority must be at least low!' })
	@Max(3, { message: 'Priority must be at most high!' })
	priority: number | null;

	@IsOptional()
	@IsNumber()
	@Min(1, { message: 'Effort must a be positive number!' })
	@Max(5, { message: 'Maximum effort value is 5!' })
	effort: number | null;

	@IsOptional()
	steps: IEditStep[];
}

export class ModifyTaskDto extends BaseTasksDto {
	taskData: Task;
	@ValidateNested({ each: true })
	@Type(() => ModifyTaskPayloadDto)
	payload: ModifyTaskPayloadDto;
}
