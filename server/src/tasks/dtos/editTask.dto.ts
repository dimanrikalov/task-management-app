import { IsNumber } from 'class-validator';
import { CreateTaskDto } from './createTask.dto';

export class EditTaskDto extends CreateTaskDto {
    @IsNumber()
    id: number;
}
