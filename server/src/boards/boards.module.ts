import { BoardsService } from './boards.service';
import { BoardsGateway } from './boards.gateway';
import { BoardsController } from './boards.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardAuth } from 'src/middlewares/boardAuth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { WorkspaceAuth } from 'src/middlewares/workspaceAuth.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [BoardsController],
    providers: [BoardsService, BoardsGateway],
})
export class BoardsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('/boards');
        consumer.apply(WorkspaceAuth).forRoutes('/boards');
        consumer.apply(BoardAuth).forRoutes('/boards/colleagues/*'); // Apply BoardAuth to all routes starting with '/boards/colleagues/'
    }
}
