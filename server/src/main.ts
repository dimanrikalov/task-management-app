import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: '*',
		methods: ['GET, POST, PUT, DELETE']
	});
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(3001);
}

bootstrap();
