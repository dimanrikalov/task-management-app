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

            const task = await this.prismaService.task.findFirst({
                where: {
                    id: step.taskId,
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

            const workspace = await this.prismaService.workspace.findFirst({
                where: {
                    id: board.workspaceId,
                },
            });

            if (!workspace) {
                throw new Error('Invalid workspace ID!');
            }

            const userIsWorkspaceOwner =
                workspace.ownerId === req.body.userData.id;

            const userHasAccessToWorkspace =
                await this.prismaService.user_Workspace.findFirst({
                    where: {
                        AND: [
                            { workspaceId: workspace.id },
                            { userId: req.body.userData.id },
                        ],
                    },
                });

            //check if user has access to the board itself
            const userHasAccessToBoard =
                await this.prismaService.user_Board.findFirst({
                    where: {
                        AND: [
                            { boardId: req.body.boardId },
                            { userId: req.body.userData.id },
                        ],
                    },
                });

            if (
                !userIsWorkspaceOwner &&
                !userHasAccessToBoard &&
                !userHasAccessToWorkspace
            ) {
                throw new Error('You do not have access to the board!');
            }

            req.body.taskData = task;
            req.body.stepData = step;

            delete req.body.taskId;

            next();
        } catch (err: any) {
            console.log(err.message);
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
