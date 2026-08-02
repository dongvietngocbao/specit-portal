import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Global prefix for API versioning (contract: /v1)
  app.setGlobalPrefix('v1');

  // Global validation — strict, whitelist unknown props
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3100'],
    credentials: true,
  });

  // OpenAPI docs
  const config = new DocumentBuilder()
    .setTitle('SpecIt Supplier Portal API')
    .setDescription('Vertical SaaS Operating System for Construction Material Suppliers')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 SpecIt API running on http://localhost:${port}/v1`, 'Bootstrap');
  Logger.log(`📖 API docs at http://localhost:${port}/docs`, 'Bootstrap');
}

bootstrap();
