import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '@sankar-dev-labs/database';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('access-token'),
    sign: jest.fn().mockReturnValue('refresh-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => (key === 'JWT_SECRET' ? 'test-secret' : undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create user and return sanitized user (no passwordHash)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        passwordHash: 'hashed',
        name: 'User',
        avatarUrl: null,
        createdAt: new Date(),
      });

      const result = await service.register({
        email: 'a@b.com',
        password: 'password123',
        name: 'User',
      });

      expect(result).toHaveProperty('id', 'u1');
      expect(result).toHaveProperty('email', 'a@b.com');
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({ email: 'a@b.com', password: 'password123' })
      ).rejects.toThrow(ConflictException);
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens when credentials valid', async () => {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash('password123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        passwordHash: hashed,
        name: 'User',
      });

      const result = await service.login({ email: 'a@b.com', password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('access-token');
    });
  });
});
