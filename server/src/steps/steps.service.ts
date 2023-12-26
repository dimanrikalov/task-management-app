import { Injectable } from '@nestjs/common';
import { EditStepDto } from './dtos/editStep.dto';
import { DeleteStepDto } from './dtos/deleteStep.dto';
import { CreateStepDto } from './dtos/createStep.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IEditStep } from 'src/tasks/dtos/modifyTask.dto';

export type IStep = {
    isComplete: boolean;
    description: string;
};

@Injectable()
export class StepsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(body: CreateStepDto) {
        const taskSteps = await this.prismaService.step.findMany({
            where: {
                taskId: body.taskData.id,
            },
        });

        const taskDescriptionIsTaken = taskSteps.some(
            (task) => task.description === body.payload.description,
        );

        if (taskDescriptionIsTaken) {
            throw new Error('Step description is already in use!');
        }

        await this.prismaService.step.create({
            data: {
                taskId: body.taskData.id,
                isComplete: body.payload.isComplete,
                description: body.payload.description,
            },
        });

        const completeStepsCount = taskSteps.reduce(
            (count, task) => count + (task.isComplete ? 1 : 0),
            body.payload.isComplete ? 1 : 0,
        );

        const progress = Math.round(
            (completeStepsCount / (taskSteps.length + 1)) * 100,
        );

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data: {
                progress,
            },
        });
    }

    async createMany(stepsData: IStep[], taskId: number) {
        const data = stepsData.map((x) => ({ ...x, taskId }));
        await this.prismaService.step.createMany({
            data,
        });
    }

    async updateMany(stepsData: IEditStep[]) {
        console.log(stepsData);
        await Promise.all(
            stepsData.map(async (step) => {
                await this.prismaService.step.update({
                    where: {
                        id: step.id,
                    },
                    data: step,
                });
            }),
        );
    }

    async edit(body: EditStepDto) {
        await this.prismaService.step.update({
            where: {
                id: body.stepId,
            },
            data: {
                isComplete: body.isComplete,
                description: body.stepData.description,
            },
        });

        //recalculate progress
        if (body.isComplete !== body.stepData.isComplete) {
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

            const progress = Math.round((completeSteps / totalSteps) * 100);

            await this.prismaService.task.update({
                where: {
                    id: body.taskData.id,
                },
                data: {
                    progress,
                },
            });
        }
    }

    async delete(body: DeleteStepDto) {
        await this.prismaService.step.delete({
            where: {
                id: body.stepId,
            },
        });

        const totalTasks = await this.prismaService.step.count({
            where: {
                taskId: body.taskData.id,
            },
        });

        const completeTask = await this.prismaService.step.count({
            where: {
                AND: [{ taskId: body.taskData.id }, { isComplete: true }],
            },
        });

        const progress = Math.round((totalTasks / completeTask) * 100);

        await this.prismaService.task.update({
            where: {
                id: body.taskData.id,
            },
            data: {
                progress,
            },
        });
    }

    async deleteMany(taskId: number) {
        await this.prismaService.step.deleteMany({
            where: {
                taskId,
            },
        });
    }

    async deleteManyNotIn(taskId: number, stepIds: number[]) {
        await this.prismaService.step.deleteMany({
            where: {
                AND: [
                    { taskId },
                    {
                        id: {
                            notIn: stepIds,
                        },
                    },
                ],
            },
        });
    }
}
