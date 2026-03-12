import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkspaceService } from './workspace.service';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @MessagePattern('getWorkspace')
  async getWorkspace(@Payload() payload: { id: string }) {
    return this.workspaceService.findOne(payload.id);
  }
}
