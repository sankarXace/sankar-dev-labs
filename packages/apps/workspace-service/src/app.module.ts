import { Module } from '@nestjs/common';
import { ConfigModule } from '@sankar-dev-labs/config';
import { DatabaseModule } from '@sankar-dev-labs/database';
import { HealthController } from './health/health.controller';
import { WorkspaceModule } from './workspace/workspace.module';
import { MemberModule } from './member/member.module';
import { DocumentModule } from './document/document.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuditModule,
    WorkspaceModule,
    MemberModule,
    DocumentModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
