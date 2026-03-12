import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { PrismaService } from '@sankar-dev-labs/database';
import { AuditService } from '../audit/audit.service';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  const mockPrisma = {
    workspace: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAudit = { write: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return workspace when found', async () => {
      const workspace = { id: 'w1', name: 'Test', slug: 'test', plan: 'free', createdAt: new Date() };
      mockPrisma.workspace.findUnique.mockResolvedValue(workspace);

      const result = await service.findOne('w1');

      expect(result).toEqual(workspace);
      expect(mockPrisma.workspace.findUnique).toHaveBeenCalledWith({ where: { id: 'w1' } });
    });

    it('should return null when not found', async () => {
      mockPrisma.workspace.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });
});
