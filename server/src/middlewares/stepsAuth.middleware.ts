import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class StepsAuthMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.taskId) {
                throw new Error('Task ID is required');
            }

            const task = await this.prismaService.task.findFirst({
                where: {
                    id: req.body.taskId,
                },
            });

            if (!task) {
                throw new Error('Invalid task ID!');
            }

            const column = await this.prismaService.column.findFirst({
                where: {
                    id: task.columnId,
                },
            });

            if (!column) {
                throw new Error('Invalid column ID!');
            }

            const board = await this.prismaService.board.findFirst({
                where: {
                    id: column.boardId,
                },
            });

            if (!board) {
                throw new Error('Invalid board ID!');
            }

            req.body.taskData = task;
            req.body.boardId = board.id;
            
            delete req.body.taskId;

            next();
        } catch (err: any) {
            console.log(err.message);
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
