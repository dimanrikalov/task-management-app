import {
    Min,
    Max,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
} from 'class-validator';
import { Task } from '@prisma/client';
import { BaseTasksDto } from './base.dto';
import { IsArrayofType } from 'src/validators/IsArrayOfType';

export class EditTaskDto extends BaseTasksDto {
    taskData: Task;

    @IsOptional()
    @IsNumber()
    columnId?: number;

    @IsOptional()
    @IsNumber()
    assigneeId?: number;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(128)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1024) // not sure what is the maximum length of a string that can be saved in a text
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1024)
    attachmentImgPath?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    estimatedHours?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(59)
    estimatedMinutes?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    hoursSpent?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(59)
    minutesSpent?: number;

    @IsOptional()
    @IsNumber()
    @Min(1) // low medium high
    @Max(3)
    priority?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    effort?: number;

    @IsOptional()
    @IsArrayofType(String)
    steps?: string[];
}