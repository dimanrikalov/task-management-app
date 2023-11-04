import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardAuthMiddleware } from 'src/middlewares/boardAuth.middleware';
import { TaskCheckMiddleware } from 'src/middlewares/taskCheck.middleware';
import { ColumnCheckMiddleware } from 'src/middlewares/columnCheck.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [TasksService, TasksGateway],
})
export class TasksModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('/tasks/*');
        consumer.apply(BoardAuthMiddleware).forRoutes('/tasks/*');
        consumer.apply(ColumnCheckMiddleware).forRoutes('/tasks/*');
        consumer
            .apply(TaskCheckMiddleware)
            .forRoutes(
                { path: '/tasks/edit', method: RequestMethod.PUT },
                { path: '/tasks', method: RequestMethod.DELETE },
            );
    }
}
