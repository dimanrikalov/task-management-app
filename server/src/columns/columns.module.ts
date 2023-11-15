import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsGateway } from './columns.gateway';
import { StepsService } from 'src/steps/steps.service';
import { TasksGateway } from 'src/tasks/tasks.gateway';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsController } from './columns.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardAuthMiddleware } from 'src/middlewares/boardAuth.middleware';
import { ColumnAuthMiddleware } from 'src/middlewares/columnAuth.middleware';

@Module({
    providers: [
        TasksService,
        StepsService,
        TasksGateway,
        ColumnsGateway,
        ColumnsService,
    ],
    imports: [PrismaModule],
    controllers: [ColumnsController],
})
export class ColumnsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware, ColumnAuthMiddleware)
            .forRoutes(
                { path: 'columns', method: RequestMethod.DELETE },
                { path: 'columns/*', method: RequestMethod.ALL },
            );
        consumer
            .apply(AuthMiddleware, BoardAuthMiddleware)
            .forRoutes({ path: 'columns', method: RequestMethod.POST });
    }
}
