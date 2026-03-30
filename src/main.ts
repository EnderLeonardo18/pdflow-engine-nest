import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Habilitar CORS para que Angular (puerto 4200) pueda consultar
  // 1. Configuración de CORS refinada
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: 'GET, POST',
    allowdHeaders: 'Content-Type, Accept',
  });


  // 2. Uso del puerto desde el .env
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
}
bootstrap();
