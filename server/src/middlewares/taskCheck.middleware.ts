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

            if (req.body.assigneeId) {
                //check if user to assign has access to the board
                const userIsWorkspaceOwner =
                    req.body.assigneeId === req.body.workspaceData.ownerId;

                const userHasAccessToWorkspace =
                    !!(await this.prismaService.user_Workspace.findFirst({
                        where: {
                            AND: [
                                { userId: req.body.assigneeId },
                                { workspaceId: req.body.boardData.workspaceId },
                            ],
                        },
                    }));

                const userHasAccessToBoard =
                    !!(await this.prismaService.user_Board.findFirst({
                        where: {
                            AND: [
                                { userId: req.body.assigneeId },
                                { boardId: req.body.boardData.id },
                            ],
                        },
                    }));

                if (
                    !userIsWorkspaceOwner &&
                    !userHasAccessToBoard &&
                    !userHasAccessToWorkspace
                ) {
                    throw new Error('Invalid assigneed id!');
                }
            }

            req.body.taskData = task;
            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
