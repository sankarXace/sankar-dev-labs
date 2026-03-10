import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  return app;
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
