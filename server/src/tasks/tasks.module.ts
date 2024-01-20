import {
	Module,
	NestModule,
	RequestMethod,
	MiddlewareConsumer
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { TaskCheckMiddleware } from 'src/middlewares/taskCheck.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { ColumnCheckMiddleware } from 'src/middlewares/columnCheck.middleware';

@Module({
	imports: [PrismaModule],
	controllers: [TasksController],
	providers: [TasksService, StepsService]
})
export class TasksModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware) // apply to all tasks endpoints
			.forRoutes('tasks*');

		consumer
			.apply(ColumnCheckMiddleware, BoardCheckMiddleware) //apply only to task creation
			.forRoutes({ path: 'tasks', method: RequestMethod.POST });

		consumer
			.apply(
				TaskCheckMiddleware,
				ColumnCheckMiddleware,
				BoardCheckMiddleware
			) //apply only to endpoints that modify an already existing task
			.forRoutes(
				{ path: 'tasks', method: RequestMethod.PUT },
				{ path: 'tasks/move', method: RequestMethod.PUT },
				{ path: 'tasks/:taskId', method: RequestMethod.PUT },
				{ path: 'tasks/:taskId', method: RequestMethod.DELETE },
				{ path: 'tasks/:taskId/complete', method: RequestMethod.PUT }
			);
	}
}
