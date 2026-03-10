import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IssueResolver } from './issue.resolver';

@Module({
  imports: [AuthModule],
  providers: [IssueResolver],
})
export class IssueModule {}
