import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TaskCheckMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await this.prismaService.task.findFirst({
                where: {
                    id: req.body.columnId,
                },
            });

            if (!task) {
                throw new Error('Invalid task ID');
            }

            req.body.taskData = task;
            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
