import {
	Injectable,
	NestMiddleware,
	NotFoundException,
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

//need to somehow extend Request and add userData to the body
@Injectable()
export class WorkspaceCheckMiddleware implements NestMiddleware {
	constructor(private readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.workspaceId && !req.body.workspaceId) {
				throw new BadRequestException('Workspace ID is required!');
			}

			const workspaceId =
				Number(req.params.workspaceId) || Number(req.body.workspaceId);

			const workspace = await this.prismaService.workspace.findFirst({
				where: {
					id: workspaceId
				}
			});
			if (!workspace) {
				throw new NotFoundException('Invalid Workspace ID!');
			}

			//check if user has access to workspace
			const userHasAccessToWorkspace =
				await this.prismaService.user_Workspace.findFirst({
					where: {
						AND: [
							{ workspaceId: workspace.id },
							{ userId: req.body.userData.id }
						]
					}
				});

			//check if user is workspace owner
			const userIsWorkspaceOwner =
				workspace.ownerId === req.body.userData.id;

			if (!userHasAccessToWorkspace && !userIsWorkspaceOwner) {
				throw new UnauthorizedException(
					'You do not have access to the workspace!'
				);
			}

			req.body.workspaceData = workspace;
			req.body.userIsWorkspaceOwner = userIsWorkspaceOwner;
			next();
		} catch (err: any) {
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}
}
