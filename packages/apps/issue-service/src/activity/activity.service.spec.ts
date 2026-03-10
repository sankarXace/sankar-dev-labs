import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('ActivityService', () => {
  let service: ActivityService;

  const mockPrisma = {
    activity: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('record should create activity entry', async () => {
    mockPrisma.activity.create.mockResolvedValue({
      id: 'a1',
      workspaceId: 'w1',
      entityType: 'issue',
      entityId: 'i1',
      action: 'CREATE',
      userId: 'u1',
    });

    const result = await service.record('w1', 'issue', 'i1', 'CREATE', 'u1');

    expect(result.id).toBe('a1');
    expect(mockPrisma.activity.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        entityType: 'issue',
        entityId: 'i1',
        action: 'CREATE',
        userId: 'u1',
        metadata: undefined,
      },
    });
  });

  it('record should accept optional metadata', async () => {
    mockPrisma.activity.create.mockResolvedValue({ id: 'a1' });

    await service.record('w1', 'issue', 'i1', 'UPDATE', 'u1', { previousStatus: 'OPEN' });

    expect(mockPrisma.activity.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        entityType: 'issue',
        entityId: 'i1',
        action: 'UPDATE',
        userId: 'u1',
        metadata: { previousStatus: 'OPEN' },
      },
    });
  });

  it('getActivityForEntity should return activities for entity', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([
      { id: 'a1', entityType: 'issue', entityId: 'i1', action: 'CREATE' },
    ]);

    const result = await service.getActivityForEntity('w1', 'issue', 'i1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1', entityType: 'issue', entityId: 'i1' },
      orderBy: { id: 'desc' },
      take: 50,
    });
  });

  it('getActivityForEntity should respect limit', async () => {
    mockPrisma.activity.findMany.mockResolvedValue([]);

    await service.getActivityForEntity('w1', 'issue', 'i1', { limit: 10 });

    expect(mockPrisma.activity.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1', entityType: 'issue', entityId: 'i1' },
      orderBy: { id: 'desc' },
      take: 10,
    });
  });
});
