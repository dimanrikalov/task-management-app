import * as fs from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { MoveTaskDto } from './dtos/moveTask.dto';
import { ModifyTaskDto } from './dtos/modifyTask.dto';
import { CreateTaskDto } from './dtos/createTask.dto';
import { StepsService } from 'src/steps/steps.service';
import { DeleteTasksDto } from './dtos/deleteTask.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadTaskImgDto } from './dtos/uploadTaskImg.dto';

const unlink = promisify(fs.unlink);

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksGateway: TasksGateway,
        private readonly stepsService: StepsService,
        private readonly prismaService: PrismaService,
    ) {}

    async getById(id: number) {
        return await this.prismaService.task.findUnique({
            where: {
                id,
            },
        });
    }

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

        return task.id;
    }

    async uploadTaskImg(body: UploadTaskImgDto) {
        // Check if the file exists before attempting to delete it
        if (fs.existsSync(body.task.attachmentImgPath)) {
            try {
                // Delete the existing file
                await unlink(body.task.attachmentImgPath);
                console.log('File deleted successfully');
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        // Update the user's profile image path
        await this.prismaService.task.update({
            where: {
                id: body.task.id,
            },
            data: {
                attachmentImgPath: body.taskImagePath,
            },
        });
    }

    async delete(body: DeleteTasksDto) {
        const { boardData, columnData, taskData } = body;
        const tasksCount = await this.prismaService.task.count({
            where: {
                columnId: columnData.id,
            },
        });

        //move the task to last place
        await this.move({
            taskData,
            boardData,
            destinationColumnId: columnData.id,
            destinationPosition: tasksCount - 1,
        });

        //delete the steps
        await this.stepsService.deleteMany(body.taskData.id);

        //delete task image if it exists
        if (fs.existsSync(body.taskData.attachmentImgPath)) {
            try {
                // Delete the existing file
                await unlink(body.taskData.attachmentImgPath);
                console.log('File deleted successfully');
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

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

        const stepsToEdit = [];
        const stepsToCreate = [];

        body.payload.steps.forEach((task) => {
            if (task.id) {
                stepsToEdit.push(task);
                return;
            }

            stepsToCreate.push(task);
        });

        const stepIdsToKeep = stepsToEdit.map((step) => step.id);
        await this.stepsService.deleteManyNotIn(
            body.taskData.id,
            stepIdsToKeep,
        );

        await this.stepsService.updateMany(stepsToEdit);
        await this.stepsService.createMany(stepsToCreate, body.taskData.id);

        delete body.payload.steps;

        //update progress
        const totalSteps = await this.prismaService.step.count({
            where: {
                taskId: body.taskData.id,
            },
        });

        const completeSteps = await this.prismaService.step.count({
            where: {
                AND: [{ taskId: body.taskData.id }, { isComplete: true }],
            },
        });

        const progress = Math.round((completeSteps / totalSteps) * 100) || 0;

        //remove image if the task has one and add it with next request
        if (body.taskData.attachmentImgPath) {
            await unlink(body.taskData.attachmentImgPath);
        }

        //update the task
        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data: {
                ...body.payload,
                progress,
                attachmentImgPath: null,
            },
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
