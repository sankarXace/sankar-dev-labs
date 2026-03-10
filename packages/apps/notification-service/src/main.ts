import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env['PORT'] ?? 3031;
  await app.listen(port);
  return app;
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
