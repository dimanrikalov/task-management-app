import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { TasksGateway } from 'src/tasks/tasks.gateway';
import { StepsService } from 'src/steps/steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BoardsService } from 'src/boards/boards.service';
import { BoardsGateway } from 'src/boards/boards.gateway';
import { ColumnsGateway } from 'src/columns/columns.gateway';
import { ColumnsService } from 'src/columns/columns.service';
import { MessagesService } from 'src/messages/messages.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { WorkspacesGateway } from 'src/workspaces/workspaces.gateway';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
    providers: [
        UsersService,
        TasksService,
        TasksGateway,
        StepsService,
        BoardsService,
        BoardsGateway,
        ColumnsGateway,
        ColumnsService,
        MessagesService,
        WorkspacesService,
        WorkspacesGateway,
    ],
    imports: [PrismaModule],
    controllers: [UsersController],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                'users/edit',
                'users/delete',
                'users/sign-up',
                'users/sign-in',
                'users/refresh',
            );
    }
}
