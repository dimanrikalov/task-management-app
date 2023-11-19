import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class StepsOperationsMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.stepId) {
                throw new Error('Step ID is required');
            }

            const step = await this.prismaService.step.findFirst({
                where: {
                    id: req.body.stepId,
                },
            });
            if (!step) {
                throw new Error('Invalid step ID!');
            }

            req.body.stepData = step;
            req.body.taskId = step.taskId;

            delete req.body.taskId;

            next();
        } catch (err: any) {
            console.log(err.message);
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
