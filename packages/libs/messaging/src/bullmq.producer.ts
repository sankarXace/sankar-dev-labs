import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, ConnectionOptions } from 'bullmq';

export interface BullMQProducerOptions {
  connection: ConnectionOptions;
  prefix?: string;
}

export interface ProducerLike {
  add(name: string, data: unknown, opts?: { delay?: number; jobId?: string }): Promise<{ id: string }>;
}

@Injectable()
export class BullMQProducerService implements OnModuleDestroy {
  private readonly connection: ConnectionOptions;
  private readonly prefix: string;
  private readonly queues = new Map<string, Queue>();

  constructor(options: BullMQProducerOptions) {
    this.connection = options.connection;
    this.prefix = options.prefix ?? 'bull';
  }

  getQueue(name: string): Queue {
    let queue = this.queues.get(name);
    if (!queue) {
      queue = new Queue(name, {
        connection: this.connection,
        prefix: this.prefix,
      });
      this.queues.set(name, queue);
    }
    return queue;
  }

  getProducer(queueName: string): ProducerLike {
    const queue = this.getQueue(queueName);
    return {
      add: async (name: string, data: unknown, opts?: { delay?: number; jobId?: string }) => {
        const job = await queue.add(name, data as object, opts);
        return { id: job.id ?? '' };
      },
    };
  }

  async onModuleDestroy() {
    await Promise.all(Array.from(this.queues.values()).map((q) => q.close()));
    this.queues.clear();
  }
}
