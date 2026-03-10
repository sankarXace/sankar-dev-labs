import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register should call authService.register', async () => {
    mockAuthService.register.mockResolvedValue({ id: '1', email: 'a@b.com' });
    await controller.register({ email: 'a@b.com', password: 'pass123', name: 'U' });
    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass123',
      name: 'U',
    });
  });

  it('login should call authService.login', async () => {
    mockAuthService.login.mockResolvedValue({ accessToken: 't', refreshToken: 'r', user: {} });
    await controller.login({ email: 'a@b.com', password: 'pass' });
    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' });
  });
});
