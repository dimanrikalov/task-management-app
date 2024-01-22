import {
	Module,
	NestModule,
	RequestMethod,
	MiddlewareConsumer
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { NotificationsService } from 'src/notifications/notifications.service';
import { WorkspaceCheckMiddleware } from 'src/middlewares/workspaceCheck.middleware';

@Module({
	providers: [
		TasksService,
		StepsService,
		BoardsService,
		ColumnsService,
		MessagesService,
		NotificationsService
	],
	imports: [PrismaModule],
	controllers: [BoardsController]
})
export class BoardsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes({ path: 'boards', method: RequestMethod.GET });

		consumer.apply(AuthMiddleware, BoardCheckMiddleware).forRoutes(
			{
				path: 'boards/:boardId',
				method: RequestMethod.DELETE
			},
			{
				path: 'boards/:boardId*',
				method: RequestMethod.ALL
			}
		);

		consumer
			.apply(AuthMiddleware, WorkspaceCheckMiddleware)
			.forRoutes({ path: 'boards', method: RequestMethod.POST });
	}
}
