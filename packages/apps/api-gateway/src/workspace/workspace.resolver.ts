import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WORKSPACE_SERVICE } from '../auth/auth.module';
import { Workspace } from './workspace.graphql';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(
    @Inject(WORKSPACE_SERVICE)
    private readonly workspaceClient: ClientProxy
  ) {}

  @Query(() => Workspace, { nullable: true })
  async workspace(@Args('id') id: string): Promise<Workspace | null> {
    const result = await firstValueFrom(
      this.workspaceClient.send<{ id: string; name: string; slug: string; plan: string } | null>(
        'getWorkspace',
        { id }
      )
    );
    if (!result) return null;
    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      plan: result.plan,
    };
  }
}
