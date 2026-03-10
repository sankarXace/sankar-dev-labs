import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Release } from '@prisma/client';

@Injectable()
export class ReleaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    data: { version: string; milestoneId?: string; notes?: string; releasedAt?: Date }
  ): Promise<Release> {
    return this.prisma.release.create({
      data: {
        workspaceId,
        version: data.version,
        milestoneId: data.milestoneId ?? null,
        notes: data.notes ?? null,
        releasedAt: data.releasedAt ?? null,
      },
    });
  }

  async findMany(workspaceId: string): Promise<Release[]> {
    return this.prisma.release.findMany({
      where: { workspaceId },
      orderBy: { releasedAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Release | null> {
    return this.prisma.release.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { version?: string; milestoneId?: string | null; notes?: string; releasedAt?: Date | null }
  ): Promise<Release> {
    return this.prisma.release.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.release.delete({ where: { id } });
  }
}
