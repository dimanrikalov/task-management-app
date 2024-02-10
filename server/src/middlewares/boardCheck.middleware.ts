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
export class BoardCheckMiddleware implements NestMiddleware {
	constructor(protected readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.boardId && !req.body.boardId) {
				throw new BadRequestException('Board ID is required!');
			}

			//check if the board exists
			const board = await this.prismaService.board.findFirst({
				where: {
					id: Number(req.params.boardId || req.body.boardId)
				}
			});
			if (!board) {
				throw new NotFoundException('Invalid board ID!');
			}

			//check if the workspace exists
			const workspace = await this.prismaService.workspace.findFirst({
				where: {
					id: board.workspaceId
				}
			});
			if (!workspace) {
				throw new NotFoundException('Invalid Workspace ID!');
			}

			//check if the user has access to the board by any of the available ways
			const userIsWorkspaceOwner =
				workspace.ownerId === req.body.userData.id;

			/*if user is trying to delete smth that is neither task, nor board, nor colleague*/
			// if (
			// 	!req.body.taskId &&
			// 	!req.body.boardId &&
			// 	!req.body.colleagueId &&
			// 	!userIsWorkspaceOwner &&
			// 	req.method.toUpperCase() === 'DELETE'
			// ) {
			// 	throw new UnauthorizedException(
			// 		'You do not have permission to delete in this workspace!'
			// 	);
			// }
			const userHasAccessToWorkspace =
				!!(await this.prismaService.user_Workspace.findFirst({
					where: {
						AND: [
							{ workspaceId: workspace.id },
							{ userId: req.body.userData.id }
						]
					}
				}));

			//check if user has access to the board itself
			const userHasAccessToBoard =
				!!(await this.prismaService.user_Board.findFirst({
					where: {
						AND: [
							{ boardId: board.id },
							{ userId: req.body.userData.id }
						]
					}
				}));

			if (
				!userIsWorkspaceOwner &&
				!userHasAccessToBoard &&
				!userHasAccessToWorkspace
			) {
				throw new UnauthorizedException(
					'You do not have access to the board!'
				);
			}

			req.body.boardData = board;
			req.body.workspaceData = workspace;
			req.body.userIsWorkspaceOwner = userIsWorkspaceOwner;
			req.body.userHasAccessToBoard = userHasAccessToBoard;
			req.body.userHasAccessToWorkspace = userHasAccessToWorkspace;

			next();
		} catch (err: any) {
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
