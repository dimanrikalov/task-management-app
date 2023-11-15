import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from '@nestjs/common';
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

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
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
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'users/edit', method: RequestMethod.PUT },
                { path: 'users/refresh', method: RequestMethod.POST },
                { path: 'users/delete', method: RequestMethod.DELETE },
            );
    }
}
