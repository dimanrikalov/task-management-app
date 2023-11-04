import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(cookieParser());
    app.useWebSocketAdapter(new IoAdapter(app));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3001);
}
bootstrap();
