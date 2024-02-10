import {
	Injectable,
	NestMiddleware,
	NotFoundException,
	BadRequestException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StepCheckMiddleware implements NestMiddleware {
	constructor(private readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.body.stepId) {
				throw new BadRequestException('Step ID is required');
			}

			const step = await this.prismaService.step.findFirst({
				where: {
					id: req.body.stepId
				}
			});
			if (!step) {
				throw new NotFoundException('Invalid step ID!');
			}

			req.body.stepData = step;
			req.body.taskId = step.taskId;

			next();
		} catch (err: any) {
			console.log(err.message);
			return res
				.status(err.response?.statusCode || 400)
				.json({ errorMessage: err.message });
		}
	}
}
