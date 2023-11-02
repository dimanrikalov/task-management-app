import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [TasksService, TasksGateway],
})
export class TasksModule {}
