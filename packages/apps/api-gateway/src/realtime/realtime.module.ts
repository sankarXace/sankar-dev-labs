import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [ConfigModule],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
