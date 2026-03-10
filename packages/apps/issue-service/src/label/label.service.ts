import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Label } from '@prisma/client';

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, data: { name: string; color?: string }): Promise<Label> {
    return this.prisma.label.create({
      data: {
        workspaceId,
        name: data.name,
        color: data.color ?? null,
      },
    });
  }

  async findMany(workspaceId: string): Promise<Label[]> {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Label | null> {
    return this.prisma.label.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; color?: string }): Promise<Label> {
    return this.prisma.label.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.label.delete({ where: { id } });
  }
}
