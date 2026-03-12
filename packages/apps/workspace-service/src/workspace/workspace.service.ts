import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Workspace } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async findOne(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({ where: { id } });
  }

  async create(
    data: { name: string; slug: string; plan?: string },
    userId?: string
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        plan: data.plan ?? 'free',
      },
    });
    if (userId) {
      await this.audit.write(workspace.id, userId, 'CREATE', 'workspace', workspace.id);
    }
    return workspace;
  }

  async update(
    id: string,
    data: { name?: string; plan?: string },
    userId?: string
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data,
    });
    if (userId) {
      await this.audit.write(id, userId, 'UPDATE', 'workspace', id);
    }
    return workspace;
  }
}
