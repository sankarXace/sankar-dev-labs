import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IssueService } from './issue.service';

@Controller()
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @MessagePattern('createIssue')
  create(
    @Payload()
    payload: {
      workspaceId: string;
      createdById: string;
      title: string;
      description?: string;
      status: string;
      priority?: string;
      assigneeId?: string;
    }
  ) {
    return this.issueService.create(payload.workspaceId, payload.createdById, {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assigneeId: payload.assigneeId,
    });
  }

  @MessagePattern('findManyIssues')
  findMany(
    @Payload()
    payload: { workspaceId: string; page?: number; limit?: number; status?: string }
  ) {
    return this.issueService.findMany(payload.workspaceId, {
      page: payload.page,
      limit: payload.limit,
      status: payload.status,
    });
  }

  @MessagePattern('getIssue')
  findOne(@Payload() payload: { id: string }) {
    return this.issueService.findOne(payload.id);
  }

  @MessagePattern('updateIssue')
  update(
    @Payload()
    payload: {
      id: string;
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string;
      userId?: string;
    }
  ) {
    return this.issueService.update(payload.id, payload, payload.userId);
  }

  @MessagePattern('deleteIssue')
  delete(@Payload() payload: { id: string; userId?: string }) {
    return this.issueService.delete(payload.id, payload.userId);
  }
}
