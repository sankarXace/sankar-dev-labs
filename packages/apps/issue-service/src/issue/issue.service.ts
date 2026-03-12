import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Issue } from '@prisma/client';
import { getSkipTake } from '@sankar-dev-labs/common';
import { ActivityService } from '../activity/activity.service';
import { IssueEventProducer } from './issue-event.producer';

@Injectable()
export class IssueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly eventProducer: IssueEventProducer
  ) {}

  async create(
    workspaceId: string,
    createdById: string,
    data: { title: string; description?: string; status: string; priority?: string; assigneeId?: string }
  ): Promise<Issue> {
    const issue = await this.prisma.issue.create({
      data: {
        workspaceId,
        createdById,
        title: data.title,
        description: data.description ?? null,
        status: data.status,
        priority: data.priority ?? null,
        assigneeId: data.assigneeId ?? null,
      },
    });
    await this.activity.record(workspaceId, 'issue', issue.id, 'CREATE', createdById);
    await this.eventProducer.emit({
      workspaceId,
      issueId: issue.id,
      event: 'issue.created',
      userId: createdById,
    });
    return issue;
  }

  async findMany(
    workspaceId: string,
    options?: { page?: number; limit?: number; status?: string }
  ): Promise<Issue[]> {
    const { skip, take } = getSkipTake(options?.page ?? 1, options?.limit ?? 20);
    return this.prisma.issue.findMany({
      where: {
        workspaceId,
        ...(options?.status ? { status: options.status } : {}),
      },
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string): Promise<Issue | null> {
    return this.prisma.issue.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { title?: string; description?: string; status?: string; priority?: string; assigneeId?: string },
    userId?: string
  ): Promise<Issue> {
    const issue = await this.prisma.issue.update({
      where: { id },
      data,
    });
    if (userId) {
      await this.activity.record(issue.workspaceId, 'issue', id, 'UPDATE', userId);
    }
    await this.eventProducer.emit({
      workspaceId: issue.workspaceId,
      issueId: id,
      event: 'issue.updated',
      userId,
    });
    return issue;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const issue = await this.prisma.issue.findUnique({ where: { id } });
    await this.prisma.issue.delete({ where: { id } });
    if (issue) {
      if (userId) {
        await this.activity.record(issue.workspaceId, 'issue', id, 'DELETE', userId);
      }
      await this.eventProducer.emit({
        workspaceId: issue.workspaceId,
        issueId: id,
        event: 'issue.deleted',
        userId,
      });
    }
  }
}
