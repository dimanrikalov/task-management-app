import { Dialect } from 'sequelize';
import { Module } from '@nestjs/common';
import { User } from './models/user.model';
import { AppService } from './app.service';
import { Board } from './models/board.model';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoardsModule } from './boards/boards.module';
import { Workspace } from './models/workspace.model';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { User_Workspace } from './models/user_workspace';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
            dialect: process.env.DIALECT as Dialect,
            host: process.env.HOST,
            port: Number(process.env.PORT),
            username: process.env.CONNECTION_USERNAME,
            password: process.env.CONNECTION_PASSWORD,
            database: process.env.DATABASE,
            define: {
                timestamps: false,
                createdAt: false,
                updatedAt: false,
            },
            models: [User, Board, User_Workspace, Workspace],
        }),
        UsersModule,
        BoardsModule,
        WorkspacesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
