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
        try {
            // Check if task name is unique in the scope of the board
            const taskNameIsTaken = !!(await this.prismaService.task.findMany({
                where: {
                    AND: [{ id: body.boardData.id }, { title: body.title }],
                },
            }));

            if (taskNameIsTaken) {
                throw new Error('Task name is taken!');
            }

            // Create task
            await this.prismaService.task.create({
                data: {
                    ...body,
                    columnId: body.columnId,
                    assigneeId: body.assigneeId,
                },
            });

            // Emit event with boardId to cause everyone on the board to refetch
            this.tasksGateway.handleTaskCreated({
                message: 'New task created.',
                affectedBoardId: body.boardData.id,
            });
        } catch (err: any) {
            console.log(err.message);
            return err.message;
        }
    }

    async edit(body: EditTaskDto) {
        if (body.title) {
            const taskNameIsTaken = !!(await this.prismaService.task.findMany({
                where: {
                    AND: [{ id: body.boardData.id }, { title: body.title }],
                },
            }));
            if (taskNameIsTaken) {
                throw new Error('Task name is taken!');
            }
        }

        const data = {
            ...(body.title && { firstName: body.title }),
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
            ...(body.priority && { hoursSpent: body.priority }),
            ...(body.columnId && { hoursSpent: body.columnId }),
            ...(body.description && { lastName: body.description }),
            ...(body.hoursSpent && { hoursSpent: body.hoursSpent }),
            ...(body.assigneeId && { hoursSpent: body.assigneeId }),
            ...(body.minutesSpent && { minutesSpent: body.minutesSpent }),
        };

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data,
        });
    }

    async delete(body: DeleteTaskDto) {
        //delete the steps
        await this.prismaService.step.deleteMany({
            where: {
                taskId: body.taskId,
            },
        });

        //delete the task
        await this.prismaService.task.delete({
            where: {
                id: body.taskId,
            },
        });
    }
}
