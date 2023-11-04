import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkspacesGateway } from './workspaces.gateway';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
    imports: [PrismaModule],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, WorkspacesGateway],
})
export class WorkspacesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('workspaces/*');
    }
}
