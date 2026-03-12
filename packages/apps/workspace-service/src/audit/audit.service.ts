import { Injectable } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async write(
    workspaceId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId: string | null,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        workspaceId,
        userId,
        action,
        resource,
        resourceId,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
  }
}
