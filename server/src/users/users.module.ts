import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
    imports: [PrismaModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('users/edit');
    }
}
