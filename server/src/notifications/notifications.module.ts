import { PrismaService } from 'src/prisma/prisma.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { NotificationsController } from './notifications.controller';
import { NotificationCheckMiddleware } from 'src/middlewares/notificationCheck.middleware';

@Module({
	controllers: [NotificationsController],
	providers: [PrismaService, NotificationsService]
})
export class NotificationsModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes('notifications');
		consumer
			.apply(AuthMiddleware, NotificationCheckMiddleware)
			.forRoutes('notifications/:notificationId');
	}
}
