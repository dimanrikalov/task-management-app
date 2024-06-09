import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { formatErrorPipe } from './pipes/formatErrors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: '*',
		methods: ['GET, POST, PUT, DELETE']
	});
	app.use(bodyParser.json({ limit: '50mb' }));
	app.useGlobalPipes(formatErrorPipe, new ValidationPipe());
	await app.listen(3001);
}

bootstrap();
