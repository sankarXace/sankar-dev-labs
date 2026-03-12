import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ActivityService } from './activity.service';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @MessagePattern('getActivityForEntity')
  getActivityForEntity(
    @Payload()
    payload: {
      workspaceId: string;
      entityType: string;
      entityId: string;
      limit?: number;
    }
  ) {
    return this.activityService.getActivityForEntity(
      payload.workspaceId,
      payload.entityType,
      payload.entityId,
      { limit: payload.limit }
    );
  }
}
