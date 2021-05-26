import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from '@src/env';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hackathon 27.05.2021')
    .setDescription('Project API')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(env.SERVER_PORT);
}
bootstrap();
