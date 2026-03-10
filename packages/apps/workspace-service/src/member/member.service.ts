import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@sankar-dev-labs/database';
import { WorkspaceRole } from '@sankar-dev-labs/interfaces';
import { AuditService } from '../audit/audit.service';

const MUTATION_ROLES = [WorkspaceRole.OWNER, WorkspaceRole.ADMIN];

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private async requireRole(workspaceId: string, userId: string, allowed: string[]): Promise<void> {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership || !allowed.includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  async addMember(
    workspaceId: string,
    actorUserId: string,
    data: { userId: string; role: string }
  ) {
    await this.requireRole(workspaceId, actorUserId, MUTATION_ROLES);
    const member = await this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: data.userId,
        role: data.role,
      },
    });
    await this.audit.write(workspaceId, actorUserId, 'CREATE', 'member', data.userId);
    return member;
  }

  async listMembers(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
    });
  }

  async changeRole(workspaceId: string, memberUserId: string, role: string, actorUserId?: string) {
    if (actorUserId) {
      await this.requireRole(workspaceId, actorUserId, MUTATION_ROLES);
    }
    const member = await this.prisma.workspaceMember.update({
      where: { userId_workspaceId: { userId: memberUserId, workspaceId } },
      data: { role },
    });
    if (actorUserId) {
      await this.audit.write(workspaceId, actorUserId, 'UPDATE', 'member', memberUserId);
    }
    return member;
  }

  async removeMember(workspaceId: string, memberUserId: string, actorUserId?: string) {
    if (actorUserId) {
      await this.requireRole(workspaceId, actorUserId, MUTATION_ROLES);
    }
    await this.prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId: memberUserId, workspaceId } },
    });
    if (actorUserId) {
      await this.audit.write(workspaceId, actorUserId, 'DELETE', 'member', memberUserId);
    }
  }
}
