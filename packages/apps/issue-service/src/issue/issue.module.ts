import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { IssueEventProducer } from './issue-event.producer';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [IssueController],
  providers: [
    IssueService,
    IssueEventProducer,
    {
      provide: 'BULLMQ_QUEUE_ISSUE_EVENTS',
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (!redisUrl) return null;
        try {
          const { Queue } = require('bullmq');
          const queue = new Queue('issue-events', {
            connection: { url: redisUrl },
            prefix: 'bull',
          });
          return { add: (name: string, data: unknown) => queue.add(name, data) };
        } catch {
          return null;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [IssueService],
})
export class IssueModule {}
