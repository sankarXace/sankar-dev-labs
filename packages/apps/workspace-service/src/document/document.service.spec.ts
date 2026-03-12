import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '@sankar-dev-labs/database';
import { AuditService } from '../audit/audit.service';

describe('DocumentService', () => {
  let service: DocumentService;

  const mockPrisma = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAudit = { write: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create document with optional parentId', async () => {
    mockPrisma.document.create.mockResolvedValue({
      id: 'd1',
      workspaceId: 'w1',
      parentId: null,
      title: 'Doc',
      content: 'x',
      createdById: 'u1',
    });

    const result = await service.create('w1', 'u1', { title: 'Doc', content: 'x' });

    expect(result.id).toBe('d1');
    expect(mockPrisma.document.create).toHaveBeenCalledWith({
      data: { workspaceId: 'w1', title: 'Doc', content: 'x', createdById: 'u1', parentId: null },
    });
  });

  it('getTree should return documents by workspace with parent relation', async () => {
    mockPrisma.document.findMany.mockResolvedValue([
      { id: 'd1', parentId: null, title: 'Root' },
      { id: 'd2', parentId: 'd1', title: 'Child' },
    ]);

    const result = await service.getTree('w1');

    expect(result).toHaveLength(2);
    expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      orderBy: { title: 'asc' },
    });
  });

  it('findOne should return document or null', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 'd1', title: 'Doc' });

    const result = await service.findOne('d1');

    expect(result?.title).toBe('Doc');
  });

  it('update should update content', async () => {
    mockPrisma.document.update.mockResolvedValue({ id: 'd1', content: 'new' });

    await service.update('d1', { content: 'new' });

    expect(mockPrisma.document.update).toHaveBeenCalledWith({
      where: { id: 'd1' },
      data: { content: 'new' },
    });
  });

  it('delete should remove document', async () => {
    mockPrisma.document.findUnique.mockResolvedValue({ id: 'd1', workspaceId: 'w1' });
    mockPrisma.document.delete.mockResolvedValue({ id: 'd1' });

    await service.delete('d1', 'u1');

    expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({ where: { id: 'd1' } });
    expect(mockPrisma.document.delete).toHaveBeenCalledWith({ where: { id: 'd1' } });
  });
});
