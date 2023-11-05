import { BoardsService } from './boards.service';
import { BoardsGateway } from './boards.gateway';
import { BoardsController } from './boards.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BoardAuthMiddleware } from 'src/middlewares/boardAuth.middleware';
import { WorkspaceAuthMiddleware } from 'src/middlewares/workspaceAuth.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [BoardsController],
    providers: [BoardsService, BoardsGateway],
})
export class BoardsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('boards');
        consumer.apply(WorkspaceAuthMiddleware).forRoutes('boards(/)'); // (/) means exact
        consumer.apply(BoardAuthMiddleware).forRoutes('boards/colleagues'); // Apply ONLY BoardAuth to all routes starting with '/boards/colleagues/'
    }
}
