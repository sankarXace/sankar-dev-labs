import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LabelService } from './label.service';

@Controller()
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @MessagePattern('createLabel')
  create(@Payload() payload: { workspaceId: string; name: string; color?: string }) {
    return this.labelService.create(payload.workspaceId, payload);
  }

  @MessagePattern('listLabels')
  findMany(@Payload() payload: { workspaceId: string }) {
    return this.labelService.findMany(payload.workspaceId);
  }

  @MessagePattern('getLabel')
  findOne(@Payload() payload: { id: string }) {
    return this.labelService.findOne(payload.id);
  }

  @MessagePattern('updateLabel')
  update(@Payload() payload: { id: string; name?: string; color?: string }) {
    return this.labelService.update(payload.id, payload);
  }

  @MessagePattern('deleteLabel')
  delete(@Payload() payload: { id: string }) {
    return this.labelService.delete(payload.id);
  }
}
