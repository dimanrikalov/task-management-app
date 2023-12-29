import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
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
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
    app.useWebSocketAdapter(new IoAdapter(app));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3001);
}

bootstrap();
