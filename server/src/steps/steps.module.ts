import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { StepsAuthMiddleware } from 'src/middlewares/stepsAuth.middleware';
import { BoardAuthMiddleware } from 'src/middlewares/boardAuth.middleware';
import { StepsOperationsMiddleware } from 'src/middlewares/stepsOperations.middleware';

@Module({
    imports: [PrismaModule],
    providers: [StepsService],
    controllers: [StepsController],
})
export class StepsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware, StepsAuthMiddleware, BoardAuthMiddleware)
            .forRoutes({ path: 'steps', method: RequestMethod.POST });

        consumer.apply(AuthMiddleware, StepsOperationsMiddleware).forRoutes(
            {
                path: 'steps',
                method: RequestMethod.PUT,
            },
            {
                path: 'steps',
                method: RequestMethod.DELETE,
            },
        );
    }
}
