import { NOTIFICATIONS_REALTIME_CHANNEL } from './realtime.module';
import { Notification } from '@prisma/client';

export interface RealtimeNotificationPayload {
  id: string;
  userId: string;
  workspaceId: string;
  type: string;
  title: string;
  body: string | null;
  readAt: Date | null;
}

export class RealtimeService {
  private publisher: { publish(channel: string, message: string): Promise<number> } | null = null;

  constructor(redisUrl: string | null) {
    if (redisUrl) {
      try {
        const Redis = require('ioredis');
        this.publisher = new Redis(redisUrl);
      } catch {
        this.publisher = null;
      }
    }
  }

  async publishNotification(notification: Notification): Promise<void> {
    if (!this.publisher) return;
    const payload: RealtimeNotificationPayload = {
      id: notification.id,
      userId: notification.userId,
      workspaceId: notification.workspaceId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      readAt: notification.readAt,
    };
    await this.publisher.publish(
      NOTIFICATIONS_REALTIME_CHANNEL,
      JSON.stringify(payload)
    );
  }
}
