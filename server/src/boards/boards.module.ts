import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsGateway } from './boards.gateway';
import { BoardsController } from './boards.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { TasksGateway } from 'src/tasks/tasks.gateway';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsGateway } from 'src/columns/columns.gateway';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { WorkspaceCheckMiddleware } from 'src/middlewares/workspaceCheck.middleware';

@Module({
    providers: [
        TasksService,
        TasksGateway,
        StepsService,
        BoardsService,
        BoardsGateway,
        ColumnsService,
        ColumnsGateway,
        MessagesService,
    ],
    imports: [PrismaModule],
    controllers: [BoardsController],
})
export class BoardsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: 'boards', method: RequestMethod.GET });

        consumer.apply(AuthMiddleware, BoardCheckMiddleware).forRoutes(
            { path: 'boards/:boardId/details', method: RequestMethod.GET },
            {
                path: 'boards/:boardId/colleagues',
                method: RequestMethod.ALL,
            },
            {
                path: 'boards/:boardId/reorder',
                method: RequestMethod.PUT,
            },
        );

        consumer.apply(AuthMiddleware, WorkspaceCheckMiddleware).forRoutes(
            {
                path: 'boards/:id',
                method: RequestMethod.DELETE,
            },
            { path: 'boards', method: RequestMethod.POST },
        );
    }
}
