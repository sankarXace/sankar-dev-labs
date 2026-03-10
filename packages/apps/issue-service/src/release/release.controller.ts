import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReleaseService } from './release.service';

@Controller()
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  @MessagePattern('createRelease')
  create(
    @Payload()
    payload: {
      workspaceId: string;
      version: string;
      milestoneId?: string;
      notes?: string;
      releasedAt?: string;
    }
  ) {
    return this.releaseService.create(payload.workspaceId, {
      version: payload.version,
      milestoneId: payload.milestoneId,
      notes: payload.notes,
      releasedAt: payload.releasedAt ? new Date(payload.releasedAt) : undefined,
    });
  }

  @MessagePattern('listReleases')
  findMany(@Payload() payload: { workspaceId: string }) {
    return this.releaseService.findMany(payload.workspaceId);
  }

  @MessagePattern('getRelease')
  findOne(@Payload() payload: { id: string }) {
    return this.releaseService.findOne(payload.id);
  }

  @MessagePattern('updateRelease')
  update(
    @Payload()
    payload: {
      id: string;
      version?: string;
      milestoneId?: string | null;
      notes?: string;
      releasedAt?: string | null;
    }
  ) {
    return this.releaseService.update(payload.id, {
      version: payload.version,
      milestoneId: payload.milestoneId,
      notes: payload.notes,
      releasedAt:
        payload.releasedAt != null ? new Date(payload.releasedAt) : payload.releasedAt,
    });
  }

  @MessagePattern('deleteRelease')
  delete(@Payload() payload: { id: string }) {
    return this.releaseService.delete(payload.id);
  }
}
