import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { EditTaskDto } from './dtos/editTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { DeleteTaskDto } from './dtos/deleteTask.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksGateway: TasksGateway,
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

        // Create task
        const task = await this.prismaService.task.create({
            data: {
                progress: 0,
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

        //Create steps
        await Promise.all(
            body.steps.map(
                (step) => async () =>
                    await this.prismaService.step.create({
                        data: {
                            taskId: task.id,
                            description: step,
                        },
                    }),
            ),
        );

        // Emit event with boardId to cause everyone on the board to refetch
        this.tasksGateway.handleTaskCreated({
            message: 'New task created.',
            affectedBoardId: body.boardData.id,
        });
    }

    async delete(body: DeleteTaskDto) {
        //delete the steps
        await this.prismaService.step.deleteMany({
            where: {
                taskId: body.taskData.id,
            },
        });

        //delete the task
        await this.prismaService.task.delete({
            where: {
                id: body.taskData.id,
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

        const data = {
            ...(body.title && { title: body.title }),
            ...(body.attachmentImgPath && {
                attachmentImgPath: body.attachmentImgPath,
            }),
            ...(body.estimatedHours && {
                estimatedHours: Number(body.estimatedHours),
            }),
            ...(body.estimatedMinutes && {
                estimatedMinutes: Number(body.estimatedMinutes),
            }),
            ...(body.effort && { effort: Number(body.effort) }),
            ...(body.priority && { priority: body.priority }),
            ...(body.columnId && { columnId: body.columnId }),
            ...(body.description && { description: body.description }),
            ...(body.hoursSpent && { hoursSpent: Number(body.hoursSpent) }),
            ...(body.assigneeId && { assigneeId: body.assigneeId }),
            ...(body.minutesSpent && { minutesSpent: body.minutesSpent }),
        };

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data,
        });
    }
}
