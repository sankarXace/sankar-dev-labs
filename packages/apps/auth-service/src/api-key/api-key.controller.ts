import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(
    @Body('workspaceId') workspaceId: string,
    @Body('userId') userId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiKeyService.create(workspaceId, userId, {
      name: dto.name,
      expiresInDays: dto.expiresInDays,
    });
  }

  @Get()
  list(
    @Query('workspaceId') workspaceId: string,
    @Query('userId') userId?: string,
  ) {
    return this.apiKeyService.list(workspaceId, userId);
  }

  @Delete(':id')
  revoke(@Param('id') id: string) {
    return this.apiKeyService.revoke(id);
  }
}
