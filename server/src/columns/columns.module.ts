import { ColumnsService } from './columns.service';
import { ColumnsGateway } from './columns.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsController } from './columns.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ColumnAuthMiddleware } from 'src/middlewares/columnAuth.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [ColumnsController],
    providers: [ColumnsService, ColumnsGateway],
})
export class ColumnsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('columns');
        consumer.apply(ColumnAuthMiddleware).forRoutes('columns'); // Apply ColumnAuthMiddleware to all endpoints inside the columns
    }
}
