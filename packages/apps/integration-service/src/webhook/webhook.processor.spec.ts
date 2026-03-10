import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { WebhookProcessor } from './webhook.processor';
import { WebhookService } from './webhook.service';
import { PrismaService } from '@sankar-dev-labs/database';

const mockFetch = jest.fn();

describe('WebhookProcessor', () => {
  let processor: WebhookProcessor;

  const webhook = {
    id: 'wh1',
    workspaceId: 'w1',
    url: 'https://example.com/hook',
    secret: 'mysecret',
    events: ['issue.created'],
    active: true,
  };

  const mockWebhookService = {
    findOne: jest.fn().mockResolvedValue(webhook),
  };

  const mockPrisma = {
    webhookDelivery: {
      create: jest.fn().mockResolvedValue({ id: 'd1' }),
    },
  };

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessor,
        { provide: WebhookService, useValue: mockWebhookService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    processor = module.get<WebhookProcessor>(WebhookProcessor);
    jest.clearAllMocks();
    mockWebhookService.findOne.mockResolvedValue(webhook);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should POST payload with HMAC signature and record delivery on success', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      text: async () => 'OK',
    });

    const job = {
      data: {
        webhookId: 'wh1',
        event: 'issue.created',
        payload: { issueId: 'i1', title: 'Bug' },
      },
      attemptsMade: 0,
    } as Job<{ webhookId: string; event: string; payload: Record<string, unknown> }, void, string>;

    await processor.process(job);

    expect(mockWebhookService.findOne).toHaveBeenCalledWith('wh1');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/hook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-webhook-signature': expect.stringMatching(/^sha256=[a-f0-9]{64}$/),
        }),
        body: JSON.stringify({ issueId: 'i1', title: 'Bug' }),
      })
    );
    expect(mockPrisma.webhookDelivery.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        webhookId: 'wh1',
        event: 'issue.created',
        payload: { issueId: 'i1', title: 'Bug' },
        statusCode: 200,
        responseBody: 'OK',
        attempts: 1,
      }),
    });
  });

  it('should record delivery with statusCode 0 on fetch failure and rethrow', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const job = {
      data: {
        webhookId: 'wh1',
        event: 'issue.updated',
        payload: {},
      },
      attemptsMade: 1,
    } as Job<{ webhookId: string; event: string; payload: Record<string, unknown> }, void, string>;

    await expect(processor.process(job)).rejects.toThrow('Network error');

    expect(mockPrisma.webhookDelivery.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        webhookId: 'wh1',
        event: 'issue.updated',
        statusCode: 0,
        responseBody: 'Network error',
        attempts: 2,
      }),
    });
  });

  it('should not process when webhook not found', async () => {
    mockWebhookService.findOne.mockResolvedValue(null);

    const job = {
      data: { webhookId: 'none', event: 'e', payload: {} },
      attemptsMade: 0,
    } as Job<{ webhookId: string; event: string; payload: Record<string, unknown> }, void, string>;

    await processor.process(job);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockPrisma.webhookDelivery.create).not.toHaveBeenCalled();
  });
});
