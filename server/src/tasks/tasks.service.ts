import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { MoveTaskDto } from './dtos/moveTask.dto';
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

    stepsHaveRepeatingDescriptions(arr: any[], propertyName: string) {
        const valueSet = new Set();

        for (const obj of arr) {
            const propertyValue = obj[propertyName]?.toLowerCase()?.trim();

            if (propertyValue && valueSet.has(propertyValue)) {
                return true; // Found repeating descriptions, no need to continue checking
            }

            valueSet.add(propertyValue);
        }

        return false; // No repeating descriptions found
    }

    async create(body: CreateTaskDto) {
        // Check if task name is unique in the scope of the board
        const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
            where: {
                AND: [
                    {
                        title: {
                            equals: body.title.toLowerCase().trim(),
                            mode: 'insensitive',
                        },
                    },
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

        if (body.assigneeId === 0) {
            throw new Error('Invalid assignee ID!');
        }

        //handle the case of no array being passed as payload
        body.steps = body.steps || [];

        //check for duplicate task description
        const isTaskDuplicate = this.stepsHaveRepeatingDescriptions(
            body.steps,
            'description',
        );

        if (isTaskDuplicate) {
            throw new Error('Task descriptions must be unqiue!');
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

        const tasksCount = await this.prismaService.task.count({
            where: {
                columnId: body.columnData.id,
            },
        });

        // Create task
        const task = await this.prismaService.task.create({
            data: {
                title: body.title,
                effort: body.effort,
                position: tasksCount,
                progress: progress || 0,
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

        //move all other tasks after the deleted task from the column with 1 position
        const columnTasks = await this.prismaService.task.findMany({
            where: {
                columnId: body.columnData.id,
            },
        });

        await Promise.all(
            columnTasks
                .filter((task) => task.position > body.taskData.position)
                .map(async (task) => {
                    await this.prismaService.task.update({
                        where: {
                            id: task.id,
                        },
                        data: {
                            position: task.position - 1,
                        },
                    });
                }),
        );
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
            tasks.map(async (task) => {
                // await the steps deletion for each task
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
        //check for any task other than the one being updated for having the same title
        const isTaskTitleTaken = !!(await this.prismaService.task.findFirst({
            where: {
                AND: [
                    {
                        title: {
                            equals: body.payload.title.trim(),
                            mode: 'insensitive',
                        },
                    },
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

    async move(body: MoveTaskDto) {
        //moving tasks between columns
        if (body.taskData.columnId !== body.destinationColumnId) {
            //make sure the columns are also part of the board!
            const sourceColumn = await this.prismaService.column.findFirst({
                where: {
                    AND: [
                        { id: body.taskData.columnId },
                        { boardId: body.boardData.id },
                    ],
                },
            });

            const destinationColumn = await this.prismaService.column.findFirst(
                {
                    where: {
                        AND: [
                            { id: body.destinationColumnId },
                            { boardId: body.boardData.id },
                        ],
                    },
                },
            );

            if (!sourceColumn || !destinationColumn) {
                throw new Error('Invalid column IDs!');
            }

            const tasksInsideSourceColumn =
                await this.prismaService.task.findMany({
                    where: {
                        columnId: sourceColumn.id,
                    },
                });

            const tasksInsideDestinationColumn =
                await this.prismaService.task.findMany({
                    where: {
                        columnId: destinationColumn.id,
                    },
                });

            //DESTINATION CHECKS
            //1st case move task between some other tasks
            //2nd case move after the last task from the column

            Promise.all(
                tasksInsideSourceColumn.map(async (task) => {
                    if (task.position > body.taskData.position) {
                        await this.prismaService.task.update({
                            where: {
                                id: task.id,
                            },
                            data: {
                                position: task.position - 1,
                            },
                        });
                    }
                }),
            );

            Promise.all(
                tasksInsideDestinationColumn.map(async (task) => {
                    if (task.position >= body.destinationPosition) {
                        await this.prismaService.task.update({
                            where: {
                                id: task.id,
                            },
                            data: {
                                position: task.position + 1,
                            },
                        });
                    }
                }),
            );

            //update the task
            await this.prismaService.task.update({
                where: {
                    id: body.taskData.id,
                },
                data: {
                    columnId: body.destinationColumnId,
                    position: body.destinationPosition,
                },
            });
            return;
        }

        const tasksInsideDestinationColumn =
            await this.prismaService.task.findMany({
                where: {
                    columnId: body.destinationColumnId,
                },
                orderBy: {
                    position: 'asc',
                },
            });

        if (body.destinationPosition == body.taskData.position) {
            return;
        }

        // Ensure the destination position is within the valid range
        if (body.destinationPosition >= tasksInsideDestinationColumn.length) {
            body.destinationPosition = tasksInsideDestinationColumn.length - 1;
        }

        if (body.destinationPosition > body.taskData.position) {
            const matches = await this.prismaService.task.findMany({
                where: {
                    AND: [
                        {
                            position: {
                                gt: body.taskData.position,
                            },
                        },
                        {
                            position: {
                                lte: body.destinationPosition,
                            },
                        },
                        { columnId: body.destinationColumnId },
                    ],
                },
            });

            await Promise.all(
                matches.map(async (task) => {
                    await this.prismaService.task.update({
                        where: {
                            id: task.id,
                        },
                        data: {
                            position: task.position - 1,
                        },
                    });
                }),
            );

            await this.prismaService.task.update({
                where: {
                    id: body.taskData.id,
                },
                data: {
                    position: body.destinationPosition,
                },
            });

            return;
        }

        const matches = await this.prismaService.task.findMany({
            where: {
                AND: [
                    {
                        position: {
                            gte: body.destinationPosition,
                        },
                    },
                    {
                        position: {
                            lt: body.taskData.position,
                        },
                    },
                    { columnId: body.destinationColumnId },
                ],
            },
        });

        await Promise.all(
            matches.map(async (task) => {
                await this.prismaService.task.update({
                    where: {
                        id: task.id,
                    },
                    data: {
                        position: task.position + 1,
                    },
                });
            }),
        );

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data: {
                position: body.destinationPosition,
            },
        });
    }
}
