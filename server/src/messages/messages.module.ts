import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessagesController } from './messages.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { BoardAuthMiddleware } from 'src/middlewares/boardAuth.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware, BoardAuthMiddleware)
            .forRoutes('messages');
    }
}
