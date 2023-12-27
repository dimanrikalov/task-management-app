import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common';

//need to somehow extend Request and add userData to the body
@Injectable()
export class BoardCheckMiddleware implements NestMiddleware {
    constructor(protected readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.boardId && !req.body.boardId) {
                throw new Error('Board ID is required!');
            }

            //check if the board exists
            const board = await this.prismaService.board.findFirst({
                where: {
                    id: Number(req.params.boardId || req.body.boardId),
                },
            });
            if (!board) {
                throw new Error('Invalid board ID!');
            }

            //check if the workspace exists
            const workspace = await this.prismaService.workspace.findFirst({
                where: {
                    id: board.workspaceId,
                },
            });
            if (!workspace) {
                throw new Error('Invalid Workspace ID!');
            }

            //check if the user has access to the board by any of the available ways
            const userIsWorkspaceOwner =
                workspace.ownerId === req.body.userData.id;

            if (
                !userIsWorkspaceOwner &&
                req.method.toUpperCase() === 'DELETE'
            ) {
                throw new Error(
                    'You do not have permission to delete in this workspace!',
                );
            }

            const userHasAccessToWorkspace =
                !!(await this.prismaService.user_Workspace.findFirst({
                    where: {
                        AND: [
                            { workspaceId: workspace.id },
                            { userId: req.body.userData.id },
                        ],
                    },
                }));

            //check if user has access to the board itself
            const userHasAccessToBoard =
                !!(await this.prismaService.user_Board.findFirst({
                    where: {
                        AND: [
                            { boardId: board.id },
                            { userId: req.body.userData.id },
                        ],
                    },
                }));

            if (
                !userIsWorkspaceOwner &&
                !userHasAccessToBoard &&
                !userHasAccessToWorkspace
            ) {
                throw new Error('You do not have access to the board!');
            }

            req.body.boardData = board;
            req.body.workspaceData = workspace;
            req.body.userIsWorkspaceOwner = userIsWorkspaceOwner;
            req.body.userHasAccessToWorkspace = userHasAccessToWorkspace;

            next();
        } catch (err: any) {
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
