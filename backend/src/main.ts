import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!existsSync('./uploads')) {
    mkdirSync('./uploads');
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.enableCors({
    origin: ['https://colombolegacy.org', 'https://www.colombolegacy.org'],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
