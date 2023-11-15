import { Injectable } from '@nestjs/common';
import { EditStepDto } from './dtos/editStep.dto';
import { DeleteStepDto } from './dtos/deleteStep.dto';
import { CreateStepDto } from './dtos/createStep.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export type IStep = {
    isComplete: boolean;
    description: string;
};

@Injectable()
export class StepsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(body: CreateStepDto) {
        const stepDescriptionIsTaken = await this.prismaService.step.findFirst({
            where: {
                AND: [
                    { taskId: body.taskData.id },
                    { description: body.payload.description },
                ],
            },
        });

        if (stepDescriptionIsTaken) {
            throw new Error('Step description is already in use!');
        }

        await this.prismaService.step.create({
            data: {
                taskId: body.taskData.id,
                isComplete: body.payload.isComplete,
                description: body.payload.description,
            },
        });
    }

    async createMany(stepsData: IStep[], taskId: number) {
        const data = stepsData.map((x) => ({ ...x, taskId }));
        await this.prismaService.step.createMany({
            data,
        });
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
    }

    async delete(body: DeleteStepDto) {
        await this.prismaService.step.delete({
            where: {
                id: body.stepId,
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
}
