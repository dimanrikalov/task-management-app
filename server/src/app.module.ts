import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { StepsModule } from './steps/steps.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { BoardsModule } from './boards/boards.module';
import { PrismaModule } from './prisma/prisma.module';
import { ColumnsModule } from './columns/columns.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        UsersModule,
        TasksModule,
        StepsModule,
        BoardsModule,
        PrismaModule,
        ColumnsModule,
        WorkspacesModule,
        ConfigModule.forRoot(),
        MessagesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
