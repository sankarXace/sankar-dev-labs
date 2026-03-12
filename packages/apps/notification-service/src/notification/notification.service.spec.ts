import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockPrisma = {
    notification: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create notification row', async () => {
    mockPrisma.notification.create.mockResolvedValue({
      id: 'n1',
      userId: 'u1',
      workspaceId: 'w1',
      type: 'issue.created',
      title: 'Issue created',
      body: 'i1',
    });

    const result = await service.create('u1', 'w1', 'issue.created', 'Issue created', 'i1');

    expect(result.id).toBe('n1');
    expect(mockPrisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        workspaceId: 'w1',
        type: 'issue.created',
        title: 'Issue created',
        body: 'i1',
      },
    });
  });

  it('create should allow optional body', async () => {
    mockPrisma.notification.create.mockResolvedValue({ id: 'n2' });

    await service.create('u1', 'w1', 'mention', 'You were mentioned');

    expect(mockPrisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        workspaceId: 'w1',
        type: 'mention',
        title: 'You were mentioned',
        body: null,
      },
    });
  });
});
