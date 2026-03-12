import { Module } from '@nestjs/common';
import { ConfigModule } from '@sankar-dev-labs/config';
import { DatabaseModule } from '@sankar-dev-labs/database';
import { HealthController } from './health/health.controller';
import { RealtimeModule } from './realtime/realtime.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ConfigModule, DatabaseModule, RealtimeModule, NotificationModule],
  controllers: [HealthController],
})
export class AppModule {}
