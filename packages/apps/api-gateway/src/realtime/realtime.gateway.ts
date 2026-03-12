import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Channel from notification-service (NOTIFICATIONS_REALTIME_CHANNEL). */
const NOTIFICATIONS_CHANNEL = 'notifications:realtime';

@WebSocketGateway({ cors: true })
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private redisSub: Redis | null = null;
  private redisPub: Redis | null = null;

  constructor(private readonly config: ConfigService) {}

  afterInit() {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redisPub = new Redis(redisUrl);
      this.redisSub = new Redis(redisUrl);
      this.server.adapter(createAdapter(this.redisPub, this.redisSub));
      const notifSub = new Redis(redisUrl);
      notifSub.subscribe(NOTIFICATIONS_CHANNEL, (err) => {
        if (err) this.logger.warn('Redis subscribe notifications failed', err);
      });
      notifSub.on('message', (channel, message) => {
        if (channel !== NOTIFICATIONS_CHANNEL) return;
        try {
          const payload = JSON.parse(message) as {
            id: string;
            userId: string;
            workspaceId: string;
            type: string;
            title: string;
            body: string | null;
          };
          this.server.to(`user:${payload.userId}`).emit('notification', payload);
          this.server.to(`workspace:${payload.workspaceId}`).emit('notification', payload);
        } catch {
          // ignore parse errors
        }
      });
    }
  }

  handleConnection(client: { id: string; join: (room: string) => void }) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: { id: string }) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  /** Call from auth flow so client can join user/workspace rooms. */
  joinUserRoom(clientId: string, userId: string) {
    this.server.in(clientId).socketsJoin(`user:${userId}`);
  }

  joinWorkspaceRoom(clientId: string, workspaceId: string) {
    this.server.in(clientId).socketsJoin(`workspace:${workspaceId}`);
  }
}
