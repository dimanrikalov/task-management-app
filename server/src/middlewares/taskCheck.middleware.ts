import {
	Injectable,
	NestMiddleware,
	NotFoundException,
	BadRequestException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

//need to somehow extend Request and add userData to the body
@Injectable()
export class TaskCheckMiddleware implements NestMiddleware {
	constructor(private readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.body.taskId && !req.params.taskId) {
				throw new BadRequestException('Task ID is required.');
			}

			// need to check if all of this information(queries) is needed
			const task = await this.prismaService.task.findFirst({
				where: {
					id: req.body.taskId || Number(req.params.taskId)
				}
			});
			if (!task) {
				throw new NotFoundException('Invalid task ID!');
			}

			req.body.taskData = task;
			req.body.columnId = task.columnId;
			delete req.body.taskId;

			next();
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
