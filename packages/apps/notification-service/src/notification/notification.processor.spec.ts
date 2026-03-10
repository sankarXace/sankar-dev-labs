import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';
import { RealtimeService } from '../realtime/realtime.service';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;

  const mockNotificationService = {
    create: jest.fn().mockResolvedValue({
      id: 'n1',
      userId: 'u1',
      workspaceId: 'w1',
      type: 'issue.created',
      title: 'Issue created',
      body: 'i1',
      readAt: null,
    }),
  };

  const mockRealtimeService = {
    publishNotification: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationProcessor,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: RealtimeService, useValue: mockRealtimeService },
      ],
    }).compile();

    processor = module.get<NotificationProcessor>(NotificationProcessor);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should create Notification and publish to realtime when job has userId', async () => {
    const job = {
      data: {
        userId: 'u1',
        workspaceId: 'w1',
        issueId: 'i1',
        event: 'issue.created',
      },
      name: 'issue.created',
    } as Job<{ userId: string; workspaceId: string; issueId: string; event: string }, void, string>;

    await processor.process(job);

    expect(mockNotificationService.create).toHaveBeenCalledWith(
      'u1',
      'w1',
      'issue.created',
      'Issue created',
      'i1'
    );
    expect(mockRealtimeService.publishNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'n1',
        userId: 'u1',
        workspaceId: 'w1',
        type: 'issue.created',
        title: 'Issue created',
        body: 'i1',
      })
    );
  });

  it('should not create Notification when userId is missing', async () => {
    const job = {
      data: {
        workspaceId: 'w1',
        issueId: 'i1',
        event: 'issue.updated',
      },
      name: 'issue.updated',
    } as Job<{ workspaceId: string; issueId: string; event: string }, void, string>;

    await processor.process(job);

    expect(mockNotificationService.create).not.toHaveBeenCalled();
  });

  it('should use event title for issue.updated and issue.deleted', async () => {
    const job = {
      data: {
        userId: 'u1',
        workspaceId: 'w1',
        issueId: 'i2',
        event: 'issue.deleted',
      },
      name: 'issue.deleted',
    } as Job<{ userId: string; workspaceId: string; issueId: string; event: string }, void, string>;

    await processor.process(job);

    expect(mockNotificationService.create).toHaveBeenCalledWith(
      'u1',
      'w1',
      'issue.deleted',
      'Issue deleted',
      'i2'
    );
  });
});
