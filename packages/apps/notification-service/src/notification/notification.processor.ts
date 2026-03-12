import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationService } from './notification.service';
import { RealtimeService } from '../realtime/realtime.service';

/** Payload shape emitted by issue-service (issue-events queue). */
export interface IssueEventPayload {
  workspaceId: string;
  issueId: string;
  event: 'issue.created' | 'issue.updated' | 'issue.deleted';
  userId?: string;
  metadata?: Record<string, unknown>;
}

const EVENT_TITLES: Record<string, string> = {
  'issue.created': 'Issue created',
  'issue.updated': 'Issue updated',
  'issue.deleted': 'Issue deleted',
};

@Processor('issue-events')
export class NotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService
  ) {
    super();
  }

  async process(job: Job<IssueEventPayload, void, string>): Promise<void> {
    const { userId, workspaceId, event, issueId } = job.data;
    if (!userId) return;
    const title = EVENT_TITLES[event] ?? event;
    const notification = await this.notificationService.create(
      userId,
      workspaceId,
      event,
      title,
      issueId
    );
    await this.realtimeService.publishNotification(notification);
  }
}
