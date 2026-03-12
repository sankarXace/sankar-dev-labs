import { Module } from '@nestjs/common';
import { ConfigModule } from '@sankar-dev-labs/config';
import { DatabaseModule } from '@sankar-dev-labs/database';
import { HealthController } from './health/health.controller';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [ConfigModule, DatabaseModule, WebhookModule],
  controllers: [HealthController],
})
export class AppModule {}
