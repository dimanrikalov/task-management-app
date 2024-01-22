import {
	Module,
	NestModule,
	RequestMethod,
	MiddlewareConsumer
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { StepsService } from 'src/steps/steps.service';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsController } from './columns.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { ColumnCheckMiddleware } from 'src/middlewares/columnCheck.middleware';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
	providers: [
		TasksService,
		StepsService,
		ColumnsService,
		NotificationsService
	],
	imports: [PrismaModule],
	controllers: [ColumnsController]
})
export class ColumnsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware, BoardCheckMiddleware)
			.forRoutes({ path: 'columns', method: RequestMethod.POST });

		consumer
			.apply(AuthMiddleware, ColumnCheckMiddleware, BoardCheckMiddleware)
			.forRoutes({ path: 'columns/*', method: RequestMethod.ALL });
	}
}
