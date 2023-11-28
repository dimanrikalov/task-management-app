import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

//need to somehow extend Request and add userData to the body
@Injectable()
export class BoardCheckMiddleware implements NestMiddleware {
    constructor(protected readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        console.log(req.params.boardId);
        try {
            if (!req.params.boardId) {
                throw new Error('Board ID is required!');
            }

            //check if the board exists
            const board = await this.prismaService.board.findFirst({
                where: {
                    id: Number(req.params.boardId),
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
                            { boardId: Number(req.params.boardId) },
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
            console.log(err.message);
            return res.status(401).json({ errorMessage: err.message });
        }
    }
}
