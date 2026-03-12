import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseService } from './release.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('ReleaseService', () => {
  let service: ReleaseService;

  const mockPrisma = {
    release: {
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
        ReleaseService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReleaseService>(ReleaseService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create release', async () => {
    mockPrisma.release.create.mockResolvedValue({
      id: 'r1',
      workspaceId: 'w1',
      version: '1.0.0',
      notes: 'Initial',
    });

    const result = await service.create('w1', {
      version: '1.0.0',
      notes: 'Initial',
    });

    expect(result.id).toBe('r1');
    expect(mockPrisma.release.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        version: '1.0.0',
        milestoneId: null,
        notes: 'Initial',
        releasedAt: null,
      },
    });
  });

  it('findMany should return releases for workspace', async () => {
    mockPrisma.release.findMany.mockResolvedValue([
      { id: 'r1', workspaceId: 'w1', version: '1.0.0' },
    ]);

    const result = await service.findMany('w1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.release.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { releasedAt: 'desc' },
    });
  });

  it('findOne should return release or null', async () => {
    mockPrisma.release.findUnique.mockResolvedValue({
      id: 'r1',
      version: '1.0.0',
    });

    const result = await service.findOne('r1');

    expect(result?.version).toBe('1.0.0');
  });

  it('update should update release', async () => {
    mockPrisma.release.update.mockResolvedValue({ id: 'r1', notes: 'Updated' });

    await service.update('r1', { notes: 'Updated' });

    expect(mockPrisma.release.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { notes: 'Updated' },
    });
  });

  it('delete should remove release', async () => {
    mockPrisma.release.delete.mockResolvedValue({ id: 'r1' });

    await service.delete('r1');

    expect(mockPrisma.release.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
  });
});
