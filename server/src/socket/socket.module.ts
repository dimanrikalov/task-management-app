import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
	providers: [SocketGateway]
})
export class SocketModule {}
