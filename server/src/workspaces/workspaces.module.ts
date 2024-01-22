import { TasksService } from 'src/tasks/tasks.service';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkspacesService } from './workspaces.service';
import { BoardsService } from 'src/boards/boards.service';
import { ColumnsService } from 'src/columns/columns.service';
import { WorkspacesController } from './workspaces.controller';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { WorkspaceCheckMiddleware } from 'src/middlewares/workspaceCheck.middleware';

@Module({
	providers: [
		TasksService,
		StepsService,
		BoardsService,
		ColumnsService,
		MessagesService,
		WorkspacesService,
		NotificationsService
	],
	imports: [PrismaModule],
	controllers: [WorkspacesController]
})
export class WorkspacesModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes('workspaces*');
		consumer
			.apply(WorkspaceCheckMiddleware)
			.forRoutes('workspaces/:workspaceId*');
	}
}
