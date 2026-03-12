import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Milestone } from '@prisma/client';

@Injectable()
export class MilestoneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    data: { title: string; dueDate?: Date; status: string }
  ): Promise<Milestone> {
    return this.prisma.milestone.create({
      data: {
        workspaceId,
        title: data.title,
        dueDate: data.dueDate ?? null,
        status: data.status,
      },
    });
  }

  async findMany(workspaceId: string): Promise<Milestone[]> {
    return this.prisma.milestone.findMany({
      where: { workspaceId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string): Promise<Milestone | null> {
    return this.prisma.milestone.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { title?: string; dueDate?: Date | null; status?: string }
  ): Promise<Milestone> {
    return this.prisma.milestone.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.milestone.delete({ where: { id } });
  }
}
