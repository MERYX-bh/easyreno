import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet.default());
  app.use(compression());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // 🔹 Servir les fichiers du dossier uploads et quotes correctement
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  console.log('✅ Dossier statique servi:', join(__dirname, '..', 'uploads'));

  await app.listen(3000);
}
bootstrap();
