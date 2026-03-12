import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { INTEGRATION_SERVICE } from '../auth/auth.module';

@Controller('webhooks')
export class WebhookController {
  constructor(
    @Inject(INTEGRATION_SERVICE)
    private readonly integrationClient: ClientProxy
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      workspaceId: string;
      url: string;
      secret: string;
      events: string[];
      active?: boolean;
    }
  ) {
    return firstValueFrom(this.integrationClient.send('createWebhook', body));
  }

  @Get()
  async list(@Query('workspaceId') workspaceId: string) {
    return firstValueFrom(
      this.integrationClient.send('listWebhooks', { workspaceId })
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return firstValueFrom(this.integrationClient.send('getWebhook', { id }));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: { url?: string; secret?: string; events?: string[]; active?: boolean }
  ) {
    return firstValueFrom(
      this.integrationClient.send('updateWebhook', { id, ...body })
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(this.integrationClient.send('deleteWebhook', { id }));
  }
}
