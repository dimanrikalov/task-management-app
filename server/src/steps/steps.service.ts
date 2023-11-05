import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    async edit() {}

    async deleteMany(taskId: number) {
        await this.prismaService.step.deleteMany({
            where: {
                taskId,
            },
        });
    }
}