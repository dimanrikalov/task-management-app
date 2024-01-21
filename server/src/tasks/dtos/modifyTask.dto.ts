import {
	Max,
	Min,
	IsString,
	IsNumber,
	MinLength,
	IsOptional
} from 'class-validator';
import { Task } from '@prisma/client';
import { BaseTasksDto } from './base.dto';
import { IStep } from 'src/steps/steps.service';

export interface IEditStep extends IStep {
	id: number;
}

class ModifyTaskPayloadDto {
	@IsString()
	@MinLength(2)
	title: string;

	@IsNumber()
	@Min(1)
	assigneeId: number;

	@IsOptional()
	@IsString()
	@MinLength(2)
	description: string | null;

	@IsOptional()
	@IsString()
	@MinLength(2)
	attachmentImgPath: string | null;

	@IsOptional()
	@IsNumber()
	@Min(0)
	estimatedHours: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(59)
	estimatedMinutes: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0)
	hoursSpent: number | null;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(59)
	minutesSpent: number | null;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	effort: number | null;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(3)
	priority: number | null;

	@IsOptional()
	steps: IEditStep[];
}

export class ModifyTaskDto extends BaseTasksDto {
	taskData: Task;
	payload: ModifyTaskPayloadDto;
}
