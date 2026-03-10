import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MilestoneService } from './milestone.service';

@Controller()
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @MessagePattern('createMilestone')
  create(
    @Payload()
    payload: { workspaceId: string; title: string; dueDate?: string; status: string }
  ) {
    return this.milestoneService.create(payload.workspaceId, {
      title: payload.title,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      status: payload.status,
    });
  }

  @MessagePattern('listMilestones')
  findMany(@Payload() payload: { workspaceId: string }) {
    return this.milestoneService.findMany(payload.workspaceId);
  }

  @MessagePattern('getMilestone')
  findOne(@Payload() payload: { id: string }) {
    return this.milestoneService.findOne(payload.id);
  }

  @MessagePattern('updateMilestone')
  update(
    @Payload()
    payload: { id: string; title?: string; dueDate?: string | null; status?: string }
  ) {
    return this.milestoneService.update(payload.id, {
      title: payload.title,
      dueDate: payload.dueDate != null ? new Date(payload.dueDate) : payload.dueDate,
      status: payload.status,
    });
  }

  @MessagePattern('deleteMilestone')
  delete(@Payload() payload: { id: string }) {
    return this.milestoneService.delete(payload.id);
  }
}
