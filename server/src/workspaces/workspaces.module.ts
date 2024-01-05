import { TasksService } from 'src/tasks/tasks.service';
import { TasksGateway } from 'src/tasks/tasks.gateway';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkspacesGateway } from './workspaces.gateway';
import { WorkspacesService } from './workspaces.service';
import { BoardsService } from 'src/boards/boards.service';
import { BoardsGateway } from 'src/boards/boards.gateway';
import { ColumnsService } from 'src/columns/columns.service';
import { ColumnsGateway } from 'src/columns/columns.gateway';
import { WorkspacesController } from './workspaces.controller';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
        WorkspacesService,
        WorkspacesGateway
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
