import { json } from 'express';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET, POST, PUT, DELETE'],
    });
    app.use(cookieParser());
    app.use(json({ limit: '500mb' }));
    app.useWebSocketAdapter(new IoAdapter(app));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3001);
}
bootstrap();
