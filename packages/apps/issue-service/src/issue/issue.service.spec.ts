import { Test, TestingModule } from '@nestjs/testing';
import { IssueService } from './issue.service';
import { PrismaService } from '@sankar-dev-labs/database';
import { ActivityService } from '../activity/activity.service';
import { IssueEventProducer } from './issue-event.producer';

describe('IssueService', () => {
  let service: IssueService;

  const mockPrisma = {
    issue: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockActivity = { record: jest.fn().mockResolvedValue(undefined) };
  const mockEventProducer = { emit: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssueService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ActivityService, useValue: mockActivity },
        { provide: IssueEventProducer, useValue: mockEventProducer },
      ],
    }).compile();

    service = module.get<IssueService>(IssueService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create issue and record activity and emit event', async () => {
    mockPrisma.issue.create.mockResolvedValue({
      id: 'i1',
      workspaceId: 'w1',
      title: 'Bug',
      status: 'OPEN',
      createdById: 'u1',
    });

    const result = await service.create('w1', 'u1', {
      title: 'Bug',
      status: 'OPEN',
    });

    expect(result.id).toBe('i1');
    expect(mockPrisma.issue.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'w1',
        createdById: 'u1',
        title: 'Bug',
        description: null,
        status: 'OPEN',
        priority: null,
        assigneeId: null,
      },
    });
    expect(mockActivity.record).toHaveBeenCalledWith('w1', 'issue', 'i1', 'CREATE', 'u1');
    expect(mockEventProducer.emit).toHaveBeenCalledWith({
      workspaceId: 'w1',
      issueId: 'i1',
      event: 'issue.created',
      userId: 'u1',
    });
  });

  it('findMany should return paginated issues for workspace', async () => {
    mockPrisma.issue.findMany.mockResolvedValue([
      { id: 'i1', workspaceId: 'w1', title: 'Issue 1', status: 'OPEN' },
    ]);

    const result = await service.findMany('w1', { page: 1, limit: 20 });

    expect(result).toHaveLength(1);
    expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1' },
      skip: 0,
      take: 20,
      orderBy: { id: 'asc' },
    });
  });

  it('findMany should filter by status when provided', async () => {
    mockPrisma.issue.findMany.mockResolvedValue([]);

    await service.findMany('w1', { page: 1, limit: 10, status: 'DONE' });

    expect(mockPrisma.issue.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'w1', status: 'DONE' },
      skip: 0,
      take: 10,
      orderBy: { id: 'asc' },
    });
  });

  it('findOne should return issue or null', async () => {
    mockPrisma.issue.findUnique.mockResolvedValue({ id: 'i1', title: 'Bug' });

    const result = await service.findOne('i1');

    expect(result?.title).toBe('Bug');
  });

  it('update should update issue and record activity and emit event', async () => {
    mockPrisma.issue.update.mockResolvedValue({
      id: 'i1',
      workspaceId: 'w1',
      status: 'DONE',
    });

    await service.update('i1', { status: 'DONE' }, 'u1');

    expect(mockPrisma.issue.update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: { status: 'DONE' },
    });
    expect(mockActivity.record).toHaveBeenCalledWith('w1', 'issue', 'i1', 'UPDATE', 'u1');
    expect(mockEventProducer.emit).toHaveBeenCalledWith({
      workspaceId: 'w1',
      issueId: 'i1',
      event: 'issue.updated',
      userId: 'u1',
    });
  });

  it('delete should remove issue and emit event', async () => {
    mockPrisma.issue.findUnique.mockResolvedValue({ id: 'i1', workspaceId: 'w1' });
    mockPrisma.issue.delete.mockResolvedValue({ id: 'i1' });

    await service.delete('i1', 'u1');

    expect(mockPrisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 'i1' } });
    expect(mockPrisma.issue.delete).toHaveBeenCalledWith({ where: { id: 'i1' } });
    expect(mockActivity.record).toHaveBeenCalledWith('w1', 'issue', 'i1', 'DELETE', 'u1');
    expect(mockEventProducer.emit).toHaveBeenCalledWith({
      workspaceId: 'w1',
      issueId: 'i1',
      event: 'issue.deleted',
      userId: 'u1',
    });
  });
});
