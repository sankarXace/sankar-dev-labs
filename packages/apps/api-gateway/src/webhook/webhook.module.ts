import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [AuthModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
