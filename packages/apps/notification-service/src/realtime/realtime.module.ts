import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RealtimeService } from './realtime.service';

/**
 * Channel and payload contract for realtime notifications.
 * Gateway (or any subscriber) should subscribe to this channel to push to WebSocket clients.
 *
 * Channel: NOTIFICATIONS_REALTIME_CHANNEL = "notifications:realtime"
 * Payload (JSON): { id, userId, workspaceId, type, title, body, readAt }
 */
export const NOTIFICATIONS_REALTIME_CHANNEL = 'notifications:realtime';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RealtimeService,
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        return new RealtimeService(redisUrl ?? null);
      },
      inject: [ConfigService],
    },
  ],
  exports: [RealtimeService],
})
export class RealtimeModule {}
