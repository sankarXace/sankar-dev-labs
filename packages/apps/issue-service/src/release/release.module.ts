import { Module } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseController } from './release.controller';

@Module({
  controllers: [ReleaseController],
  providers: [ReleaseService],
  exports: [ReleaseService],
})
export class ReleaseModule {}
