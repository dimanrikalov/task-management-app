import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { EditTaskDto } from './dtos/editTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { DeleteTaskDto } from './dtos/deleteTask.dto';
import { StepsService } from 'src/steps/steps.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksGateway: TasksGateway,
        private readonly stepsService: StepsService,
        private readonly prismaService: PrismaService,
    ) {}

    async create(body: CreateTaskDto) {
        // Check if task name is unique in the scope of the board
        const tasksWithName = await this.prismaService.task.findMany({
            where: {
                AND: [{ id: body.boardData.id }, { title: body.title }],
            },
        });
        if (tasksWithName.length > 0) {
            throw new Error('Task title is taken!');
        }

        //calculate the progress based on how many tasks are completed
        const completeSteps = body.steps.filter((step) => {
            if (step.isComplete) {
                return step;
            }
        });
        const progress = Math.round(
            (completeSteps.length / body.steps.length) * 100,
        );

        // Create task
        const task = await this.prismaService.task.create({
            data: {
                progress,
                title: body.title,
                effort: body.effort,
                priority: body.priority,
                assigneeId: body.assigneeId,
                hoursSpent: body.hoursSpent,
                columnId: body.columnData.id,
                description: body.description,
                minutesSpent: body.minutesSpent,
                estimatedHours: body.estimatedHours,
                estimatedMinutes: body.estimatedMinutes,
                attachmentImgPath: body.attachmentImgPath,
            },
        });

        // Create steps
        await this.stepsService.createMany(body.steps, task.id);

        // Emit event with boardId to cause everyone on the board to refetch
        this.tasksGateway.handleTaskCreated({
            message: 'New task created.',
            affectedBoardId: body.boardData.id,
        });
    }

    async delete(body: DeleteTaskDto) {
        //delete the steps
        await this.stepsService.deleteMany(body.taskData.id);

        //delete the task
        await this.prismaService.task.delete({
            where: {
                id: body.taskData.id,
            },
        });
    }

    async deleteMany(columnId: number) {
        //get all tasks from the column
        const tasks = await this.prismaService.task.findMany({
            where: {
                columnId,
            },
        });

        //delete all steps of every task from the column
        await Promise.all(
            tasks.map((task) => async () => {
                await this.stepsService.deleteMany(task.id);
            }),
        );

        //delete the tasks themselves
        await this.prismaService.task.deleteMany({
            where: {
                columnId,
            },
        });
    }

    async edit(body: EditTaskDto) {
        if (body.title) {
            const tasksWithName = await this.prismaService.task.findMany({
                where: {
                    AND: [{ id: body.boardData.id }, { title: body.title }],
                },
            });
            if (tasksWithName.length > 0) {
                throw new Error('Task name is taken!');
            }
        }

        //update the steps
        if (body.steps.length > 0) {
            await Promise.all(
                body.steps.map((step) => async () => {
                    await this.stepsService.edit(step);
                }),
            );
        }

        //update the task
        const data = {
            ...(body.attachmentImgPath && {
                attachmentImgPath: body.attachmentImgPath,
            }),
            ...(body.estimatedHours && {
                estimatedHours: Number(body.estimatedHours),
            }),
            ...(body.estimatedMinutes && {
                estimatedMinutes: Number(body.estimatedMinutes),
            }),
            ...(body.title && { title: body.title }),
            ...(body.priority && { priority: body.priority }),
            ...(body.columnId && { columnId: body.columnId }),
            ...(body.effort && { effort: Number(body.effort) }),
            ...(body.assigneeId && { assigneeId: body.assigneeId }),
            ...(body.description && { description: body.description }),
            ...(body.minutesSpent && { minutesSpent: body.minutesSpent }),
            ...(body.hoursSpent && { hoursSpent: Number(body.hoursSpent) }),
        };

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data,
        });
    }
}
