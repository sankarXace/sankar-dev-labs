import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    workspaceId: string,
    type: string,
    title: string,
    body?: string
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId,
        workspaceId,
        type,
        title,
        body: body ?? null,
      },
    });
  }
}
