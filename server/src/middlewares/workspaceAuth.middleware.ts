import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

//need to somehow extend Request and add userData to the body
@Injectable()
export class WorkspaceAuthMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const workspace = await this.prismaService.workspace.findFirst({
                where: {
                    id: req.body.workspaceId,
                },
            });

            if (!workspace) {
                throw new Error('Invalid Workspace ID!');
            }

            //check if user has access to workspace
            const userHasAccessToWorkspace =
                await this.prismaService.user_Workspace.findFirst({
                    where: {
                        AND: [
                            { userId: req.body.userData.id },
                            { workspaceId: workspace.id },
                        ],
                    },
                });

            //check if user is workspace owner
            const userIsWorkspaceOwner =
                workspace.ownerId === req.body.userData.id;

            if (!userHasAccessToWorkspace && !userIsWorkspaceOwner) {
                throw new Error('You do not have access to the workspace!');
            }

            req.body.workspaceData = workspace; //add the whole workspace data
            delete req.body.workspaceId; //remove the workspaceId as it can be accessed through workspaceData
            next();
        } catch (err: any) {
            return res.status(401).json({ message: err.message });
        }
    }
}
