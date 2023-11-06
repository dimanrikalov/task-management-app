import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [StepsService],
})
export class StepsModule {}
