import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Webhook } from '@prisma/client';

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    workspaceId: string;
    url: string;
    secret: string;
    events: string[];
    active?: boolean;
  }): Promise<Webhook> {
    return this.prisma.webhook.create({
      data: {
        workspaceId: data.workspaceId,
        url: data.url,
        secret: data.secret,
        events: data.events,
        active: data.active ?? true,
      },
    });
  }

  async findMany(workspaceId: string): Promise<Webhook[]> {
    return this.prisma.webhook.findMany({
      where: { workspaceId },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string): Promise<Webhook | null> {
    return this.prisma.webhook.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { url?: string; secret?: string; events?: string[]; active?: boolean }
  ): Promise<Webhook> {
    return this.prisma.webhook.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.webhook.delete({ where: { id } });
  }

  async findActiveByEvent(event: string): Promise<Webhook[]> {
    return this.prisma.webhook.findMany({
      where: { active: true, events: { has: event } },
    });
  }
}
