import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/createTask.dto';
import { Body, Controller, Headers, Post } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(@Headers() headers, @Body() body: CreateTaskDto) {
        const authorizationToken = headers.authorization;
        // return this.tasksService.create({ ...body, authorizationToken });
    }
}
