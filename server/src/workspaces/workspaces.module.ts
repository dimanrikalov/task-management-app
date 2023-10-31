import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Workspace } from '../models/workspace.model';
import { WorkspacesGateway } from './workspaces.gateway';
import { WorkspacesService } from './workspaces.service';
import { User_Workspace } from 'src/models/user_workspace';
import { WorkspacesController } from './workspaces.controller';

@Module({
    imports: [SequelizeModule.forFeature([Workspace, User_Workspace])],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, WorkspacesGateway],
})
export class WorkspacesModule {}
