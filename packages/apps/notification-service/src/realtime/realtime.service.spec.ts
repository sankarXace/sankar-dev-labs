import { RealtimeService } from './realtime.service';
import { NOTIFICATIONS_REALTIME_CHANNEL } from './realtime.module';

describe('RealtimeService', () => {
  it('should publish expected payload to Redis when publisher is set', async () => {
    const publish = jest.fn().mockResolvedValue(1);
    const service = new RealtimeService(null);
    (service as unknown as { publisher: { publish: jest.Mock } }).publisher = { publish };

    const notification = {
      id: 'n1',
      userId: 'u1',
      workspaceId: 'w1',
      type: 'issue.created',
      title: 'Issue created',
      body: 'i1',
      readAt: null,
    };

    await service.publishNotification(notification as any);

    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith(
      NOTIFICATIONS_REALTIME_CHANNEL,
      JSON.stringify({
        id: 'n1',
        userId: 'u1',
        workspaceId: 'w1',
        type: 'issue.created',
        title: 'Issue created',
        body: 'i1',
        readAt: null,
      })
    );
  });

  it('should no-op when publisher is null (no REDIS_URL)', async () => {
    const service = new RealtimeService(null);
    const notification = {
      id: 'n1',
      userId: 'u1',
      workspaceId: 'w1',
      type: 'issue.created',
      title: 'Issue created',
      body: null,
      readAt: null,
    };

    await expect(service.publishNotification(notification as any)).resolves.not.toThrow();
  });
});
