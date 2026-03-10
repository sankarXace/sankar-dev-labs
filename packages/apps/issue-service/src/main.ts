import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tcpPort = Number(process.env['ISSUE_TCP_PORT'] ?? 3020);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: tcpPort },
  });
  await app.startAllMicroservices();
  const port = process.env['PORT'] ?? 3021;
  await app.listen(port);
  return app;
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
