import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('AuditService', () => {
  let service: AuditService;

  const mockPrisma = {
    auditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('write should create audit log entry', async () => {
    mockPrisma.auditLog.create.mockResolvedValue({
      id: 'a1',
      workspaceId: 'w1',
      userId: 'u1',
      action: 'CREATE',
      resource: 'workspace',
      resourceId: 'w1',
    });

    await service.write('w1', 'u1', 'CREATE', 'workspace', 'w1');

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        userId: 'u1',
        action: 'CREATE',
        resource: 'workspace',
        resourceId: 'w1',
        ipAddress: null,
        userAgent: null,
      },
    });
  });

  it('write should accept optional ip and userAgent', async () => {
    mockPrisma.auditLog.create.mockResolvedValue({});

    await service.write('w1', 'u1', 'UPDATE', 'document', 'd1', '1.2.3.4', 'Mozilla/5');

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        userId: 'u1',
        action: 'UPDATE',
        resource: 'document',
        resourceId: 'd1',
        ipAddress: '1.2.3.4',
        userAgent: 'Mozilla/5',
      },
    });
  });
});
