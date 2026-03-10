import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern('createWebhook')
  create(
    @Payload()
    payload: {
      workspaceId: string;
      url: string;
      secret: string;
      events: string[];
      active?: boolean;
    }
  ) {
    return this.webhookService.create(payload);
  }

  @MessagePattern('listWebhooks')
  findMany(@Payload() payload: { workspaceId: string }) {
    return this.webhookService.findMany(payload.workspaceId);
  }

  @MessagePattern('getWebhook')
  findOne(@Payload() payload: { id: string }) {
    return this.webhookService.findOne(payload.id);
  }

  @MessagePattern('updateWebhook')
  update(
    @Payload()
    payload: {
      id: string;
      url?: string;
      secret?: string;
      events?: string[];
      active?: boolean;
    }
  ) {
    return this.webhookService.update(payload.id, payload);
  }

  @MessagePattern('deleteWebhook')
  delete(@Payload() payload: { id: string }) {
    return this.webhookService.delete(payload.id);
  }
}
