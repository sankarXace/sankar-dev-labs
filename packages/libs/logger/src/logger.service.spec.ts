import { Test } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();
    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have log, error, warn, debug methods', () => {
    expect(typeof service.log).toBe('function');
    expect(typeof service.error).toBe('function');
    expect(typeof service.warn).toBe('function');
    expect(typeof service.debug).toBe('function');
  });

  it('should log without throwing', () => {
    expect(() => service.log('test message')).not.toThrow();
  });

  it('should return a child logger with bindings', () => {
    const child = service.child({ requestId: 'req-1' });
    expect(child).toBeDefined();
    expect(child).toBeInstanceOf(LoggerService);
    expect(() => child.log('child message')).not.toThrow();
  });
});
