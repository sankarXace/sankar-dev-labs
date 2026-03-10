import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

/**
 * Guard that ensures the request has a workspaceId (e.g. from WorkspaceIdPipe)
 * and optionally that the user is a member. Used after auth and workspace resolution.
 */
@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { workspaceId?: string; user?: { sub: string } }>();
    const workspaceId = request.workspaceId ?? request.params?.['workspaceId'] ?? request.query?.['workspaceId'];
    if (!workspaceId) {
      throw new ForbiddenException('Workspace context required');
    }
    request.workspaceId = workspaceId;
    return true;
  }
}
