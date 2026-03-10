import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { Document } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async create(
    workspaceId: string,
    createdById: string,
    data: { title: string; content?: string; parentId?: string }
  ): Promise<Document> {
    const doc = await this.prisma.document.create({
      data: {
        workspaceId,
        createdById,
        title: data.title,
        content: data.content ?? null,
        parentId: data.parentId ?? null,
      },
    });
    await this.audit.write(workspaceId, createdById, 'CREATE', 'document', doc.id);
    return doc;
  }

  async getTree(workspaceId: string): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: { workspaceId },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: { title?: string; content?: string },
    userId?: string
  ): Promise<Document> {
    const doc = await this.prisma.document.update({
      where: { id },
      data,
    });
    if (userId) {
      await this.audit.write(doc.workspaceId, userId, 'UPDATE', 'document', id);
    }
    return doc;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    await this.prisma.document.delete({ where: { id } });
    if (userId && doc) {
      await this.audit.write(doc.workspaceId, userId, 'DELETE', 'document', id);
    }
  }
}
