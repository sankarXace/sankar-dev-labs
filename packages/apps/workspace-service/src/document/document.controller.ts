import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentService } from './document.service';

@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @MessagePattern('createDocument')
  create(@Payload() payload: { workspaceId: string; createdById: string; title: string; content?: string; parentId?: string }) {
    return this.documentService.create(payload.workspaceId, payload.createdById, {
      title: payload.title,
      content: payload.content,
      parentId: payload.parentId,
    });
  }

  @MessagePattern('getDocumentTree')
  getTree(@Payload() payload: { workspaceId: string }) {
    return this.documentService.getTree(payload.workspaceId);
  }

  @MessagePattern('getDocument')
  findOne(@Payload() payload: { id: string }) {
    return this.documentService.findOne(payload.id);
  }

  @MessagePattern('updateDocument')
  update(@Payload() payload: { id: string; title?: string; content?: string; userId?: string }) {
    return this.documentService.update(payload.id, payload, payload.userId);
  }

  @MessagePattern('deleteDocument')
  delete(@Payload() payload: { id: string; userId?: string }) {
    return this.documentService.delete(payload.id, payload.userId);
  }
}
