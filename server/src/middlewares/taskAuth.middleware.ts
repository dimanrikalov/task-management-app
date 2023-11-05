import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TaskAuthMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // need to check if all of this information(queries) is needed
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

            const workspace = await this.prismaService.workspace.findFirst({
                where: {
                    id: board.workspaceId,
                },
            });
            if (!workspace) {
                throw new Error('Invalid workspace ID!');
            }

            //check if the user that is accessing the TaskModule has access to the board
            const userIsWorkspaceOwner =
                workspace.ownerId === req.body.userData.id;

            const userHasAccessToWorkspace =
                await this.prismaService.user_Workspace.findFirst({
                    where: {
                        AND: [
                            { userId: req.body.userData.id },
                            { workspaceId: workspace.id },
                        ],
                    },
                });

            const userHasAccessToBoard =
                await this.prismaService.user_Board.findFirst({
                    where: {
                        AND: [
                            { userId: req.body.userData.id },
                            { boardId: board.id },
                        ],
                    },
                });

            if (
                !userIsWorkspaceOwner &&
                !userHasAccessToBoard &&
                !userHasAccessToWorkspace
            ) {
                throw new Error('You do not have access to this board!');
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
                    throw new Error('Invalid assignee id!');
                }
            }
            
            req.body.taskData = task;
            req.body.boardData = board;
            req.body.columnData = column;
            req.body.workspaceData = workspace;

            delete req.body.taskId;

            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
