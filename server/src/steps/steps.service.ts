import { Injectable } from '@nestjs/common';
import { EditStepDto } from './dtos/editStep.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteStepDto } from './dtos/deleteStep.dto';

export type IStep = {
    isComplete: boolean;
    description: string;
};

@Injectable()
export class StepsService {
    constructor(private readonly prismaService: PrismaService) {}
    async create(stepData: IStep, taskId: number) {
        await this.prismaService.step.create({
            data: {
                ...stepData,
                taskId,
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
                description: body.description,
                isComplete: body.isComplete,
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
