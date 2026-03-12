import { Test, TestingModule } from '@nestjs/testing';
import { MilestoneService } from './milestone.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('MilestoneService', () => {
  let service: MilestoneService;

  const mockPrisma = {
    milestone: {
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
        MilestoneService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MilestoneService>(MilestoneService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create milestone', async () => {
    const due = new Date('2026-06-01');
    mockPrisma.milestone.create.mockResolvedValue({
      id: 'm1',
      workspaceId: 'w1',
      title: 'Sprint 1',
      dueDate: due,
      status: 'open',
    });

    const result = await service.create('w1', {
      title: 'Sprint 1',
      dueDate: due,
      status: 'open',
    });

    expect(result.id).toBe('m1');
    expect(mockPrisma.milestone.create).toHaveBeenCalledWith({
      data: { workspaceId: 'w1', title: 'Sprint 1', dueDate: due, status: 'open' },
    });
  });

  it('findMany should return milestones for workspace', async () => {
    mockPrisma.milestone.findMany.mockResolvedValue([
      { id: 'm1', workspaceId: 'w1', title: 'Sprint 1', status: 'open' },
    ]);

    const result = await service.findMany('w1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.milestone.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { dueDate: 'asc' },
    });
  });

  it('findOne should return milestone or null', async () => {
    mockPrisma.milestone.findUnique.mockResolvedValue({
      id: 'm1',
      title: 'Sprint 1',
    });

    const result = await service.findOne('m1');

    expect(result?.title).toBe('Sprint 1');
  });

  it('update should update milestone', async () => {
    mockPrisma.milestone.update.mockResolvedValue({ id: 'm1', status: 'closed' });

    await service.update('m1', { status: 'closed' });

    expect(mockPrisma.milestone.update).toHaveBeenCalledWith({
      where: { id: 'm1' },
      data: { status: 'closed' },
    });
  });

  it('delete should remove milestone', async () => {
    mockPrisma.milestone.delete.mockResolvedValue({ id: 'm1' });

    await service.delete('m1');

    expect(mockPrisma.milestone.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
  });
});
