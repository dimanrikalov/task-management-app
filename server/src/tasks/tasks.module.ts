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
import { TaskAuthMiddleware } from 'src/middlewares/taskAuth.middleware';
import { ColumnAuthMiddleware } from 'src/middlewares/columnAuth.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [TasksService, TasksGateway],
})
export class TasksModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('tasks');
        consumer.apply(ColumnAuthMiddleware).forRoutes('tasks(/)');
        consumer
            .apply(TaskAuthMiddleware)
            .forRoutes(
                { path: '/tasks/edit', method: RequestMethod.PUT },
                { path: '/tasks', method: RequestMethod.DELETE },
            );
    }
}
