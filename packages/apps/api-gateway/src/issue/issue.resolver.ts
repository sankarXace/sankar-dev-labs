import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ISSUE_SERVICE } from '../auth/auth.module';
import { Issue } from './issue.graphql';

@Resolver(() => Issue)
export class IssueResolver {
  constructor(
    @Inject(ISSUE_SERVICE)
    private readonly issueClient: ClientProxy
  ) {}

  @Query(() => Issue, { nullable: true })
  async issue(@Args('id') id: string): Promise<Issue | null> {
    const result = await firstValueFrom(
      this.issueClient.send<{
        id: string;
        workspaceId: string;
        title: string;
        description?: string | null;
        status: string;
        priority?: string | null;
        assigneeId?: string | null;
        createdById: string;
      } | null>('getIssue', { id })
    );
    if (!result) return null;
    return {
      id: result.id,
      workspaceId: result.workspaceId,
      title: result.title,
      description: result.description ?? undefined,
      status: result.status,
      priority: result.priority ?? undefined,
      assigneeId: result.assigneeId ?? undefined,
      createdById: result.createdById,
    };
  }

  @Query(() => [Issue])
  async issues(
    @Args('workspaceId') workspaceId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit?: number,
    @Args('status', { nullable: true }) status?: string
  ): Promise<Issue[]> {
    const result = await firstValueFrom(
      this.issueClient.send<
        Array<{
          id: string;
          workspaceId: string;
          title: string;
          description?: string | null;
          status: string;
          priority?: string | null;
          assigneeId?: string | null;
          createdById: string;
        }>
      >('findManyIssues', { workspaceId, page, limit, status })
    );
    return (result ?? []).map((r) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      title: r.title,
      description: r.description ?? undefined,
      status: r.status,
      priority: r.priority ?? undefined,
      assigneeId: r.assigneeId ?? undefined,
      createdById: r.createdById,
    }));
  }
}
