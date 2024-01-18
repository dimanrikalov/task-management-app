import {
	Injectable,
	NestMiddleware,
	NotFoundException,
	BadRequestException,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotificationCheckMiddleware implements NestMiddleware {
	constructor(private readonly prismaService: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.params.notificationId) {
				throw new BadRequestException('Notification ID is required');
			}

			const notification =
				await this.prismaService.notification.findFirst({
					where: {
						id: Number(req.params.notificationId)
					}
				});
			if (!notification) {
				throw new NotFoundException('Invalid step ID!');
			}

			if (notification.userId !== req.body.userData.id) {
				throw new UnauthorizedException('Unauthorized request!');
			}

			req.body.notificationData = notification;

			next();
		} catch (err: any) {
			console.log(err.message);
			const { statusCode, message: errorMessage } = err.response;
			return res.status(statusCode || 400).json({ errorMessage });
		}
	}
}
