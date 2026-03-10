import { Test, TestingModule } from '@nestjs/testing';
import { LabelService } from './label.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('LabelService', () => {
  let service: LabelService;

  const mockPrisma = {
    label: {
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
        LabelService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LabelService>(LabelService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create label', async () => {
    mockPrisma.label.create.mockResolvedValue({
      id: 'l1',
      workspaceId: 'w1',
      name: 'bug',
      color: '#ff0000',
    });

    const result = await service.create('w1', { name: 'bug', color: '#ff0000' });

    expect(result.id).toBe('l1');
    expect(mockPrisma.label.create).toHaveBeenCalledWith({
      data: { workspaceId: 'w1', name: 'bug', color: '#ff0000' },
    });
  });

  it('findMany should return labels for workspace', async () => {
    mockPrisma.label.findMany.mockResolvedValue([
      { id: 'l1', workspaceId: 'w1', name: 'bug' },
    ]);

    const result = await service.findMany('w1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.label.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { name: 'asc' },
    });
  });

  it('findOne should return label or null', async () => {
    mockPrisma.label.findUnique.mockResolvedValue({ id: 'l1', name: 'bug' });

    const result = await service.findOne('l1');

    expect(result?.name).toBe('bug');
  });

  it('update should update label', async () => {
    mockPrisma.label.update.mockResolvedValue({ id: 'l1', color: '#00ff00' });

    await service.update('l1', { color: '#00ff00' });

    expect(mockPrisma.label.update).toHaveBeenCalledWith({
      where: { id: 'l1' },
      data: { color: '#00ff00' },
    });
  });

  it('delete should remove label', async () => {
    mockPrisma.label.delete.mockResolvedValue({ id: 'l1' });

    await service.delete('l1');

    expect(mockPrisma.label.delete).toHaveBeenCalledWith({ where: { id: 'l1' } });
  });
});
