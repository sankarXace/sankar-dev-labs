import { Module } from '@nestjs/common';
import { ConfigModule } from '@sankar-dev-labs/config';
import { DatabaseModule } from '@sankar-dev-labs/database';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule],
  controllers: [HealthController],
})
export class AppModule {}
