import { Injectable, Optional, Inject } from '@nestjs/common';

export const ISSUE_EVENT_QUEUE = 'issue-events';

export interface IssueEventPayload {
  workspaceId: string;
  issueId: string;
  event: 'issue.created' | 'issue.updated' | 'issue.deleted';
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface IssueEventProducerLike {
  emit(payload: IssueEventPayload): Promise<void>;
}

@Injectable()
export class IssueEventProducer implements IssueEventProducerLike {
  private readonly queue: { add(name: string, data: unknown): Promise<{ id: string }> } | null;

  constructor(
    @Optional()
    @Inject('BULLMQ_QUEUE_ISSUE_EVENTS')
    queue: { add(name: string, data: unknown): Promise<{ id: string }> } | null
  ) {
    this.queue = queue ?? null;
  }

  async emit(payload: IssueEventPayload): Promise<void> {
    if (this.queue) {
      await this.queue.add(payload.event, payload);
    }
  }
}
