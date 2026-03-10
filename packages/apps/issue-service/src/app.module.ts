import { Module } from '@nestjs/common';
import { ConfigModule } from '@sankar-dev-labs/config';
import { DatabaseModule } from '@sankar-dev-labs/database';
import { HealthController } from './health/health.controller';
import { IssueModule } from './issue/issue.module';
import { LabelModule } from './label/label.module';
import { MilestoneModule } from './milestone/milestone.module';
import { ReleaseModule } from './release/release.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ActivityModule,
    IssueModule,
    LabelModule,
    MilestoneModule,
    ReleaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
