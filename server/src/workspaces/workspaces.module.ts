import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkspacesGateway } from './workspaces.gateway';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

@Module({
    imports: [PrismaModule],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, WorkspacesGateway],
})
export class WorkspacesModule {}
