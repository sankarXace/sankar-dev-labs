import { BullMQProducerService } from './bullmq.producer';

describe('BullMQProducerService', () => {
  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
  };

  let service: BullMQProducerService;

  beforeEach(() => {
    service = new BullMQProducerService({ connection: { host: 'localhost', port: 6379 } });
    jest.spyOn(service, 'getQueue').mockReturnValue(mockQueue as never);
    mockQueue.add.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add job to named queue', async () => {
    const producer = service.getProducer('test-queue');
    await producer.add('job-name', { payload: 123 });
    expect(service.getQueue).toHaveBeenCalledWith('test-queue');
    expect(mockQueue.add).toHaveBeenCalledWith('job-name', { payload: 123 }, undefined);
  });
});
