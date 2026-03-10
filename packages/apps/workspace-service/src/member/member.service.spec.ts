import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { PrismaService } from '@sankar-dev-labs/database';
import { AuditService } from '../audit/audit.service';

describe('MemberService', () => {
  let service: MemberService;

  const mockPrisma = {
    workspaceMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAudit = { write: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMember should create membership', async () => {
    mockPrisma.workspaceMember.findUnique.mockResolvedValue({ role: 'ADMIN' });
    mockPrisma.workspaceMember.create.mockResolvedValue({
      userId: 'u1',
      workspaceId: 'w1',
      role: 'MEMBER',
    });

    await service.addMember('w1', 'adminUserId', { userId: 'u1', role: 'MEMBER' });

    expect(mockPrisma.workspaceMember.create).toHaveBeenCalledWith({
      data: { workspaceId: 'w1', userId: 'u1', role: 'MEMBER' },
    });
  });

  it('listMembers should return members for workspace', async () => {
    mockPrisma.workspaceMember.findMany.mockResolvedValue([
      { userId: 'u1', workspaceId: 'w1', role: 'OWNER' },
    ]);

    const result = await service.listMembers('w1');

    expect(result).toHaveLength(1);
    expect(mockPrisma.workspaceMember.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
    });
  });

  it('changeRole should update member role', async () => {
    mockPrisma.workspaceMember.update.mockResolvedValue({
      userId: 'u1',
      workspaceId: 'w1',
      role: 'ADMIN',
    });

    await service.changeRole('w1', 'u1', 'ADMIN');

    expect(mockPrisma.workspaceMember.update).toHaveBeenCalledWith({
      where: { userId_workspaceId: { userId: 'u1', workspaceId: 'w1' } },
      data: { role: 'ADMIN' },
    });
  });

  it('removeMember should delete membership', async () => {
    mockPrisma.workspaceMember.delete.mockResolvedValue({});

    await service.removeMember('w1', 'u1');

    expect(mockPrisma.workspaceMember.delete).toHaveBeenCalledWith({
      where: { userId_workspaceId: { userId: 'u1', workspaceId: 'w1' } },
    });
  });
});
