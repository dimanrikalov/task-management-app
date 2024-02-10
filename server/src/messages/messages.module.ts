import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketGateway } from 'src/socket/socket.gateway';
import { MessagesController } from './messages.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
	imports: [PrismaModule],
	controllers: [MessagesController],
	providers: [MessagesService, NotificationsService, SocketGateway]
})
export class MessagesModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware, BoardCheckMiddleware)
			.forRoutes('boards/:boardId/messages');
	}
}
