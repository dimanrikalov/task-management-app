import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ColumnsController } from './columns.controller';
import { ColumnsGateway } from './columns.gateway';

@Module({
    imports: [PrismaModule],
    controllers: [ColumnsController],
    providers: [ColumnsService, ColumnsGateway],
})
export class ColumnsModule {}
