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
import { TaskCheckMiddleware } from 'src/middlewares/taskCheck.middleware';
import { StepCheckMiddleware } from 'src/middlewares/stepCheck.middleware';
import { BoardCheckMiddleware } from 'src/middlewares/boardCheck.middleware';
import { ColumnCheckMiddleware } from 'src/middlewares/columnCheck.middleware';

@Module({
    imports: [PrismaModule],
    providers: [StepsService],
    controllers: [StepsController],
})
export class StepsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                AuthMiddleware,
                TaskCheckMiddleware,
                ColumnCheckMiddleware,
                BoardCheckMiddleware,
            )
            .forRoutes({ path: 'steps', method: RequestMethod.POST });

        consumer
            .apply(
                AuthMiddleware,
                StepCheckMiddleware,
                TaskCheckMiddleware,
                ColumnCheckMiddleware,
                BoardCheckMiddleware,
            )
            .forRoutes(
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
