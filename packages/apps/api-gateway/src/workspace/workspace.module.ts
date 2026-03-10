import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceResolver } from './workspace.resolver';

@Module({
  imports: [AuthModule],
  providers: [WorkspaceResolver],
})
export class WorkspaceModule {}
