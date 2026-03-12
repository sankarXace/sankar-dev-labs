import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('WebhookService', () => {
  let service: WebhookService;

  const mockPrisma = {
    webhook: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create webhook', async () => {
    mockPrisma.webhook.create.mockResolvedValue({
      id: 'wh1',
      workspaceId: 'w1',
      url: 'https://example.com/hook',
      secret: 'sec',
      events: ['issue.created'],
      active: true,
    });

    const result = await service.create({
      workspaceId: 'w1',
      url: 'https://example.com/hook',
      secret: 'sec',
      events: ['issue.created'],
    });

    expect(result.id).toBe('wh1');
    expect(mockPrisma.webhook.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        url: 'https://example.com/hook',
        secret: 'sec',
        events: ['issue.created'],
        active: true,
      },
    });
  });

  it('findMany should return webhooks for workspace', async () => {
    mockPrisma.webhook.findMany.mockResolvedValue([
      { id: 'wh1', workspaceId: 'w1', url: 'https://a.com', events: ['issue.created'] },
    ]);

    const result = await service.findMany('w1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.webhook.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { id: 'asc' },
    });
  });

  it('findOne should return webhook or null', async () => {
    mockPrisma.webhook.findUnique.mockResolvedValue({ id: 'wh1', url: 'https://a.com' });

    const result = await service.findOne('wh1');

    expect(result?.url).toBe('https://a.com');
  });

  it('update should update webhook', async () => {
    mockPrisma.webhook.update.mockResolvedValue({ id: 'wh1', active: false });

    await service.update('wh1', { active: false });

    expect(mockPrisma.webhook.update).toHaveBeenCalledWith({
      where: { id: 'wh1' },
      data: { active: false },
    });
  });

  it('delete should remove webhook', async () => {
    mockPrisma.webhook.delete.mockResolvedValue({ id: 'wh1' });

    await service.delete('wh1');

    expect(mockPrisma.webhook.delete).toHaveBeenCalledWith({ where: { id: 'wh1' } });
  });

  it('findActiveByEvent should return active webhooks subscribed to event', async () => {
    mockPrisma.webhook.findMany.mockResolvedValue([
      { id: 'wh1', events: ['issue.created'], active: true },
    ]);

    const result = await service.findActiveByEvent('issue.created');

    expect(result).toHaveLength(1);
    expect(mockPrisma.webhook.findMany).toHaveBeenCalledWith({
      where: { active: true, events: { has: 'issue.created' } },
    });
  });
});
