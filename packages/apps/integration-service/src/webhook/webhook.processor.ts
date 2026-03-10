import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { createHmac } from 'crypto';
import { WebhookService } from './webhook.service';
import { PrismaService } from '@sankar-dev-labs/database';

export const WEBHOOK_DELIVERY_QUEUE = 'webhook-deliveries';

export interface WebhookDeliveryJobPayload {
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
}

const SIGNATURE_HEADER = 'x-webhook-signature';

function signPayload(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

@Processor(WEBHOOK_DELIVERY_QUEUE)
export class WebhookProcessor extends WorkerHost {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly prisma: PrismaService
  ) {
    super();
  }

  async process(job: Job<WebhookDeliveryJobPayload, void, string>): Promise<void> {
    const { webhookId, event, payload } = job.data;
    const webhook = await this.webhookService.findOne(webhookId);
    if (!webhook || !webhook.active) return;

    const body = JSON.stringify(payload);
    const signature = signPayload(webhook.secret, body);

    let statusCode: number | null = null;
    let responseBody: string | null = null;

    try {
      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [SIGNATURE_HEADER]: `sha256=${signature}`,
        },
        body,
      });
      statusCode = res.status;
      responseBody = await res.text();
      if (statusCode >= 400) {
        throw new Error(`HTTP ${statusCode}`);
      }
    } catch (err) {
      if (statusCode == null) {
        statusCode = 0;
        responseBody = err instanceof Error ? err.message : String(err);
      }
      throw err;
    } finally {
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId,
          event,
          payload: payload as object,
          statusCode,
          responseBody: responseBody?.slice(0, 10000) ?? null,
          attempts: job.attemptsMade + 1,
        },
      });
    }
  }
}
