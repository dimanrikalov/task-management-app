import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
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
        const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
            where: {
                AND: [
                    { title: body.title },
                    {
                        Column: {
                            boardId: body.boardData.id,
                        },
                    },
                ],
            },
            distinct: ['id'],
        }));

        if (isTaskTitleTaken) {
            throw new Error('Task title is taken!');
        }

        body.steps = body.steps || [];

        //calculate the progress based on how many tasks are completed
        const completeSteps = body.steps.filter((step) => {
            if (step.isComplete) {
                return step;
            }
        });
        const progress = Math.round(
            (completeSteps.length / body.steps.length) * 100,
        );

        if (body.assigneeId === 0) {
            throw new Error('Invalid assignee ID!');
        }

        //check if assigneeId has access to board
        const assigneeHasAccessToBoard =
            !!(await this.prismaService.user.findFirst({
                where: {
                    OR: [
                        {
                            User_Workspace: {
                                some: {
                                    AND: [
                                        { userId: body.assigneeId },
                                        { workspaceId: body.workspaceData.id },
                                    ],
                                },
                            },
                        },
                        {
                            User_Board: {
                                some: {
                                    AND: [
                                        { userId: body.assigneeId },
                                        { boardId: body.boardData.id },
                                    ],
                                },
                            },
                        },
                    ],
                },
            }));

        const assigneeIsWorkspaceOwner =
            body.assigneeId === body.workspaceData.ownerId;

        if (!assigneeIsWorkspaceOwner && !assigneeHasAccessToBoard) {
            throw new Error('Assignee does not have access to board!');
        }

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

    async delete(body: ModifyTaskDto) {
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

    //task steps are updated separately!
    async edit(body: ModifyTaskDto) {
        const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
            where: {
                AND: [
                    { title: body.payload.title },
                    {
                        Column: {
                            boardId: body.boardData.id,
                        },
                    },
                    {
                        NOT: {
                            id: body.taskData.id,
                        },
                    },
                ],
            },
            distinct: ['id'],
        }));

        if (isTaskTitleTaken) {
            throw new Error('Task title is taken!');
        }

        //update the task
        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data: body.payload,
        });
    }
}
