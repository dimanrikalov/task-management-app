import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';

@Module({
    imports: [PrismaModule],
    providers: [MessagesService],
    controllers: [MessagesController],
})
export class MessagesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware, BoardCheckMiddleware)
            .forRoutes('boards/:boardId/messages');
    }
}
