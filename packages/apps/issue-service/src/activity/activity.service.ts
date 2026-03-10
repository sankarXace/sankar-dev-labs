import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Activity } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    workspaceId: string,
    entityType: string,
    entityId: string,
    action: string,
    userId: string,
    metadata?: Record<string, unknown>
  ): Promise<Activity> {
    return this.prisma.activity.create({
      data: {
        workspaceId,
        entityType,
        entityId,
        action,
        userId,
        metadata: metadata as object | undefined,
      },
    });
  }

  async getActivityForEntity(
    workspaceId: string,
    entityType: string,
    entityId: string,
    options?: { limit?: number }
  ): Promise<Activity[]> {
    const take = Math.min(options?.limit ?? 50, 100);
    return this.prisma.activity.findMany({
      where: { workspaceId, entityType, entityId },
      orderBy: { id: 'desc' },
      take,
    });
  }
}
