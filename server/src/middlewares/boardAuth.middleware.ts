import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

//need to somehow extend Request and add userData to the body
@Injectable()
export class BoardAuth implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            //check if the board exists
            const board = await this.prismaService.board.findFirst({
                where: {
                    id: req.body.boardId,
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
                await this.prismaService.user_Workspace.findFirst({
                    where: {
                        AND: [
                            { userId: req.body.userData.id },
                            { workspaceId: workspace.id },
                        ],
                    },
                });

            //check if user has access to the board itself
            const userHasAccessToBoard =
                await this.prismaService.user_Board.findFirst({
                    where: {
                        AND: [
                            { userId: req.body.userData.id },
                            { boardId: req.body.boardId },
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

            req.body.boardData = board; //add the whole board data
            req.body.workspaceData = workspace; // add the whole workspace data
            delete req.body.boardId; //remove the boardId as it can be accessed through boardData
            next();
        } catch (err: any) {
            return res.status(401).json({ message: err.message });
        }
    }
}
