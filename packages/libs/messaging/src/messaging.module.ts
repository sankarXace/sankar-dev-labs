import { Global, Module } from '@nestjs/common';
import { BullMQProducerService } from './bullmq.producer';

@Global()
@Module({
  providers: [BullMQProducerService],
  exports: [BullMQProducerService],
})
export class MessagingModule {}
