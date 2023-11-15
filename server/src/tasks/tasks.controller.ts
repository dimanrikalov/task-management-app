import { Response } from 'express';
import { TasksService } from './tasks.service';
import { EditTaskDto } from './dtos/editTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { DeleteTaskDto } from './dtos/deleteTask.dto';
import { Body, Controller, Delete, Post, Put, Res } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(@Res() res: Response, @Body() body: CreateTaskDto) {
        try {
            await this.tasksService.create(body);
            return res.status(200).json({
                message: 'Task created successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async delete(@Res() res: Response, @Body() body: DeleteTaskDto) {
        try {
            await this.tasksService.delete(body);
            return res.status(200).json({
                message: 'Task deleted successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put()
    async edit(@Res() res: Response, @Body() body: EditTaskDto) {
        try {
            await this.tasksService.edit(body);
            return res.status(200).json({
                message: 'Task modified successfully.',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put()
    async move() {}
}
