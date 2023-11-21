import { Response } from 'express';
import { TasksService } from './tasks.service';
import { MoveTaskDto } from './dtos/moveTask.dto';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { Body, Controller, Delete, Post, Put, Res } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(@Res() res: Response, @Body() body: CreateTaskDto) {
        try {
            await this.tasksService.create(body);
            return res.status(200).json({
                message: 'Task created successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Delete()
    async delete(@Res() res: Response, @Body() body: ModifyTaskDto) {
        try {
            await this.tasksService.delete(body);
            return res.status(200).json({
                message: 'Task deleted successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put()
    async edit(@Res() res: Response, @Body() body: ModifyTaskDto) {
        try {
            await this.tasksService.edit(body);
            return res.status(200).json({
                message: 'Task modified successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }

    @Put('/move')
    async move(@Res() res: Response, @Body() body: MoveTaskDto) {
        try {
            await this.tasksService.move(body);
            return res.status(200).json({
                message: 'Task moved successfully!',
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(400).json({
                errorMessage: err.message,
            });
        }
    }
}
