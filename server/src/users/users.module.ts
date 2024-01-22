import {
	Module,
	NestModule,
	RequestMethod,
	MiddlewareConsumer
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BoardsService } from 'src/boards/boards.service';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
	providers: [
		UsersService,
		TasksService,
		StepsService,
		BoardsService,
		ColumnsService,
		MessagesService,
		WorkspacesService,
		NotificationsService
	],
	imports: [PrismaModule],
	controllers: [UsersController]
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer //exclude sign-in, sign-up refresh endpoints
			.apply(AuthMiddleware)
			.forRoutes(
				'user',
				'users/edit*',
				'users/stats',
				'users/delete',
				{ path: 'users', method: RequestMethod.GET },
				{ path: 'users', method: RequestMethod.POST }
			);
	}
}
