import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsGateway } from './boards.gateway';
import { BoardsController } from './boards.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BoardsController],
    providers: [BoardsService, BoardsGateway],
})
export class BoardsModule {}
