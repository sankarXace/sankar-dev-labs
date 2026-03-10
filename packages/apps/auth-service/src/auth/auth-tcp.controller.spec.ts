import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiKeyService } from '../api-key/api-key.service';
import { AuthTcpController } from './auth-tcp.controller';

describe('AuthTcpController', () => {
  let controller: AuthTcpController;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => (key === 'JWT_SECRET' ? 'test-secret' : undefined)),
  };

  const mockApiKeyService = {
    validateKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthTcpController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ApiKeyService, useValue: mockApiKeyService },
      ],
    }).compile();

    controller = module.get<AuthTcpController>(AuthTcpController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user payload when token is valid', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', email: 'u@x.com' });

    const result = await controller.validateToken({ token: 'valid.jwt.here' });

    expect(result).toEqual({ sub: 'user-1', email: 'u@x.com' });
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.here', expect.any(Object));
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

    await expect(controller.validateToken({ token: 'bad' })).rejects.toThrow(UnauthorizedException);
  });
});
