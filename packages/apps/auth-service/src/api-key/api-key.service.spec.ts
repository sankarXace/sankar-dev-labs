import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  const mockPrisma = {
    apiKey: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create API key and return raw key once (hash stored in DB)', async () => {
      mockPrisma.apiKey.create.mockResolvedValue({
        id: 'key-1',
        workspaceId: 'ws-1',
        userId: 'u-1',
        keyHash: 'hashed',
        name: 'My Key',
        lastUsedAt: null,
        expiresAt: null,
      });

      const result = await service.create('ws-1', 'u-1', { name: 'My Key' });

      expect(result).toHaveProperty('id', 'key-1');
      expect(result).toHaveProperty('rawKey');
      expect(typeof result.rawKey).toBe('string');
      expect(result.rawKey!.length).toBeGreaterThan(20);
      expect(mockPrisma.apiKey.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            workspaceId: 'ws-1',
            userId: 'u-1',
            name: 'My Key',
            keyHash: expect.any(String),
          }),
        })
      );
    });
  });

  describe('list', () => {
    it('should return API keys for workspace (without raw key)', async () => {
      mockPrisma.apiKey.findMany.mockResolvedValue([
        { id: 'k1', name: 'Key 1', workspaceId: 'ws-1', userId: 'u-1', keyHash: 'h', lastUsedAt: null, expiresAt: null },
      ]);

      const result = await service.list('ws-1', 'u-1');

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('rawKey');
      expect(result[0].name).toBe('Key 1');
    });
  });

  describe('revoke', () => {
    it('should delete API key by id', async () => {
      mockPrisma.apiKey.delete.mockResolvedValue({ id: 'k1' });

      await service.revoke('k1');

      expect(mockPrisma.apiKey.delete).toHaveBeenCalledWith({ where: { id: 'k1' } });
    });
  });

  describe('validateKey', () => {
    it('should return workspaceId and userId when key is valid', async () => {
      mockPrisma.apiKey.findFirst.mockResolvedValue({
        workspaceId: 'ws-1',
        userId: 'u-1',
      });

      const result = await service.validateKey('valid-plain-key');

      expect(result).toEqual({ workspaceId: 'ws-1', userId: 'u-1' });
    });

    it('should return null when key not found', async () => {
      mockPrisma.apiKey.findFirst.mockResolvedValue(null);

      const result = await service.validateKey('unknown-key');

      expect(result).toBeNull();
    });
  });
});
