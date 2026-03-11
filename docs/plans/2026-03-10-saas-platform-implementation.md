# SaaS Developer Workflow Platform — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Linear + Notion-style developer workflow platform as an Nx monorepo with six NestJS microservices, shared libs (database, auth, config, messaging, etc.), GraphQL + REST at the gateway, and Docker/CI.

**Architecture:** Microservices with NestJS TCP for sync RPC and BullMQ (Redis) for async events. Single Prisma schema in a shared database lib; multi-tenancy via `workspaceId` on all tenant-scoped tables. API Gateway is the only public entrypoint; internal services are reached via ClientProxy.

**Tech Stack:** Nx 22, NestJS, Prisma, PostgreSQL, Redis, BullMQ, GraphQL (code-first Apollo), JWT, Pino, Joi, Supertest, Jest. Reference: @docs/plans/2026-03-10-saas-platform-design.md

---

## Phase 1: Monorepo layout and database foundation

### Task 1: Package layout (apps/ and libs/)

**Files:**
- Create: `packages/apps/package.json`
- Create: `packages/libs/package.json`
- Modify: `package.json` (workspaces to include `packages/apps/*`, `packages/libs/*` if needed; design says `packages/*` so ensure `packages/apps` and `packages/libs` exist as placeholders or use `packages/apps/*` and `packages/libs/*`)

**Step 1: Ensure workspace layout**

Current root `package.json` has `"workspaces": ["packages/*"]`. Add `packages/apps` and `packages/libs` as directories. Use workspaces `["packages/apps/*", "packages/libs/*"]` so each app and lib is a workspace member.

**Step 2: Create apps and libs package.json**

- `packages/apps/package.json`: `{ "name": "@sankar-dev-labs/apps", "private": true }`
- `packages/libs/package.json`: `{ "name": "@sankar-dev-labs/libs", "private": true }`

**Step 3: Verify**

Run: `npm install`
Expected: No errors; workspace roots recognized.

**Step 4: Commit**

```bash
git add package.json packages/apps/package.json packages/libs/package.json
git commit -m "chore: add packages/apps and packages/libs layout"
```

---

### Task 2: Database lib — Prisma schema and client

**Files:**
- Create: `packages/libs/database/package.json`
- Create: `packages/libs/database/project.json`
- Create: `packages/libs/database/tsconfig.json`
- Create: `packages/libs/database/tsconfig.lib.json`
- Create: `packages/libs/database/prisma/schema.prisma`
- Create: `packages/libs/database/src/index.ts`
- Create: `packages/libs/database/src/prisma.service.ts`
- Test: `packages/libs/database/src/prisma.service.spec.ts`

**Step 1: Write the failing test**

In `packages/libs/database/src/prisma.service.spec.ts`:

```typescript
import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('should be defined', () => {
    const service = new PrismaService();
    expect(service).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx nx run database:test --testPathPattern=prisma.service.spec` (or from `packages/libs/database`: `npx jest prisma.service.spec.ts -v`)
Expected: FAIL (module/import or PrismaService not found until implemented).

**Step 3: Minimal implementation**

- Add Prisma schema in `packages/libs/database/prisma/schema.prisma` with datasource `postgresql`, generator `client`, and models: `User`, `Workspace`, `WorkspaceMember`, `ApiKey`, `Issue`, `Label`, `Milestone`, `Release`, `Document`, `Activity`, `AuditLog`, `Notification`, `Webhook`, `WebhookDelivery` (fields as in design doc).
- Create `PrismaService` in `packages/libs/database/src/prisma.service.ts` extending `PrismaClient` with `onModuleInit`/`onModuleDestroy` connect/disconnect.
- Export from `packages/libs/database/src/index.ts`: `PrismaService`, `PrismaClient`.
- Add `database` to Nx with build and test targets in `project.json`; add NestJS and Prisma deps to `packages/libs/database/package.json`.

**Step 4: Run test to verify it passes**

Run: `npx nx run database:test`
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/libs/database/
git commit -m "feat(database): add Prisma schema and PrismaService"
```

---

### Task 3: Database lib — first migration and seed script

**Files:**
- Modify: `packages/libs/database/package.json` (scripts: migrate, seed)
- Create: `packages/libs/database/prisma/migrations/20260310000000_init/migration.sql` (or use `npx prisma migrate dev`)
- Create: `packages/libs/database/prisma/seed.ts`
- Modify: `packages/libs/database/project.json` (targets: migrate, seed)

**Step 1: Add migration**

Run: `cd packages/libs/database && npx prisma migrate dev --name init`
Expected: Migration created and applied (requires running PostgreSQL).

**Step 2: Add seed script**

Seed creates one workspace, one admin user, sample issues and docs. Use `prisma/seed.ts` and in `package.json`: `"prisma": { "seed": "ts-node prisma/seed.ts" }`. Nx target `database:migrate` runs `prisma migrate deploy`, `database:seed` runs `prisma db seed`.

**Step 3: Verify**

Run: `npx nx run database:migrate` (or equivalent)
Expected: Migrations applied.
Run: `npx nx run database:seed`
Expected: Seed completes without error.

**Step 4: Commit**

```bash
git add packages/libs/database/prisma/
git add packages/libs/database/package.json packages/libs/database/project.json
git commit -m "feat(database): add initial migration and seed"
```

---

### Task 4: Config lib — validated env (Joi)

**Files:**
- Create: `packages/libs/config/package.json`
- Create: `packages/libs/config/project.json`
- Create: `packages/libs/config/tsconfig.json`
- Create: `packages/libs/config/src/index.ts`
- Create: `packages/libs/config/src/config.module.ts`
- Create: `packages/libs/config/src/validation.schema.ts`
- Test: `packages/libs/config/src/validation.schema.spec.ts`

**Step 1: Write failing test**

Test that validation schema rejects invalid env (e.g. missing `DATABASE_URL` or wrong shape).

**Step 2: Run test — expect fail**

**Step 3: Implement**

Use `@nestjs/config` and Joi: `Joi.object({ DATABASE_URL: Joi.string().uri().required(), ... })`. Export `ConfigModule` and validation schema. Each app will import `ConfigModule.forRoot({ validationSchema })`.

**Step 4: Run test — expect pass**

**Step 5: Commit**

```bash
git add packages/libs/config/
git commit -m "feat(config): add validated env config with Joi"
```

---

## Phase 2: Shared libs (auth, common, logger, interfaces, dto, permissions, messaging)

### Task 5: Interfaces lib — enums and constants

**Files:**
- Create: `packages/libs/interfaces/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/interfaces/src/roles.ts` (enum OWNER, ADMIN, MEMBER, VIEWER)
- Create: `packages/libs/interfaces/src/issue-status.ts`, `priority.ts`, etc.

**Step 1–5:** Add lib with TypeScript-only exports (no NestJS). No test required per skill if purely types; or add a trivial test that re-exports and compiles. Commit: `feat(interfaces): add shared enums and constants`.

---

### Task 6: Common lib — base entities, pagination, errors, filters

**Files:**
- Create: `packages/libs/common/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/common/src/filters/all-exceptions.filter.ts`
- Create: `packages/libs/common/src/filters/prisma-exception.filter.ts`
- Create: `packages/libs/common/src/pagination/pagination.dto.ts`, `pagination.helper.ts`
- Create: `packages/libs/common/src/errors/*.ts`
- Test: `packages/libs/common/src/**/*.spec.ts` for pagination and error mapping

**Step 1: Write failing tests** for pagination helper (e.g. `getSkipTake(page, limit)` returns correct values).
**Step 2: Run tests — fail**
**Step 3: Implement** pagination DTO and helper; exception filters that map Prisma errors to HTTP status.
**Step 4: Run tests — pass**
**Step 5: Commit** `feat(common): add pagination, error classes, exception filters`

---

### Task 7: Logger lib — Pino structured logger

**Files:**
- Create: `packages/libs/logger/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/logger/src/logger.module.ts`, `logger.service.ts` (wraps pino), request context
- Test: `packages/libs/logger/src/logger.service.spec.ts`

**Step 1–5:** TDD: logger service defined and injectable; test that it logs with expected structure. Commit: `feat(logger): add Pino logger and request context`.

---

### Task 8: Auth lib — JWT strategy, guards, decorators

**Files:**
- Create: `packages/libs/auth/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/auth/src/jwt.strategy.ts`
- Create: `packages/libs/auth/src/guards/jwt-auth.guard.ts`, `roles.guard.ts`, `api-key.guard.ts`
- Create: `packages/libs/auth/src/decorators/current-user.decorator.ts`, `roles.decorator.ts`, `public.decorator.ts`
- Test: `packages/libs/auth/src/guards/jwt-auth.guard.spec.ts`, decorators unit tests

**Step 1: Write failing test** (e.g. JwtAuthGuard returns 401 when no token).
**Step 2: Run — fail**
**Step 3: Implement** JWT strategy (Passport), guards, decorators. Depend on `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`.
**Step 4: Run — pass**
**Step 5: Commit** `feat(auth): add JWT strategy, guards, decorators`

---

### Task 9: Permissions lib — RBAC and WorkspaceId pipe

**Files:**
- Create: `packages/libs/permissions/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/permissions/src/roles.ts` (role-to-permission mapping)
- Create: `packages/libs/permissions/src/pipes/workspace-id.pipe.ts`
- Create: `packages/libs/permissions/src/guards/workspace-member.guard.ts`
- Test: `packages/libs/permissions/src/pipes/workspace-id.pipe.spec.ts`

**Step 1–5:** TDD: WorkspaceIdPipe extracts workspace from query/param and validates; role checks. Commit: `feat(permissions): add RBAC and WorkspaceId pipe`.

---

### Task 10: DTO lib — shared DTOs and GraphQL inputs

**Files:**
- Create: `packages/libs/dto/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/dto/src/workspace.dto.ts`, `issue.dto.ts`, `pagination.dto.ts` (re-export or define)
- Use class-validator; optional GraphQL `@InputType()` classes for code-first later.

**Step 1–5:** Add DTOs used by multiple services (e.g. CreateWorkspaceDto, UpdateIssueDto). Minimal test that DTOs validate. Commit: `feat(dto): add shared DTOs`.

---

### Task 11: Messaging lib — BullMQ producer/consumer and Redis

**Files:**
- Create: `packages/libs/messaging/package.json`, `project.json`, `tsconfig.json`, `src/index.ts`
- Create: `packages/libs/messaging/src/messaging.module.ts`
- Create: `packages/libs/messaging/src/bullmq.producer.ts`, `bullmq.consumer.ts` (generic queue name + handler registration)
- Test: `packages/libs/messaging/src/bullmq.producer.spec.ts` (mock Redis, assert job added)

**Step 1: Write failing test** — producer adds job to named queue.
**Step 2: Run — fail**
**Step 3: Implement** BullMQ connection, producer service, consumer registration (NestJS `@Processor()`).
**Step 4: Run — pass**
**Step 5: Commit** `feat(messaging): add BullMQ producer and consumer module`

---

## Phase 3: Auth service

### Task 12: Auth service bootstrap

**Files:**
- Create: `packages/apps/auth-service/package.json`, `project.json`, `tsconfig.json`, `tsconfig.app.json`
- Create: `packages/apps/auth-service/src/main.ts`
- Create: `packages/apps/auth-service/src/app.module.ts`
- Create: `packages/apps/auth-service/test/app.e2e-spec.ts`

**Step 1: E2E test** — GET /health or similar returns 200.
**Step 2: Run e2e — fail** (app not running or route missing).
**Step 3: Implement** NestJS app with AppModule (import ConfigModule, DatabaseModule), listen on port from env.
**Step 4: Run e2e — pass**
**Step 5: Commit** `feat(auth-service): bootstrap NestJS app`

---

### Task 13: Auth service — registration and login (REST)

**Files:**
- Create: `packages/apps/auth-service/src/auth/auth.module.ts`, `auth.service.ts`, `auth.controller.ts`
- Create: `packages/apps/auth-service/src/auth/dto/register.dto.ts`, `login.dto.ts`
- Test: `packages/apps/auth-service/src/auth/auth.service.spec.ts`, `auth.controller.spec.ts`

**Step 1: Write failing tests** — register creates user and returns sanitized user; login returns access + refresh tokens.
**Step 2: Run — fail**
**Step 3: Implement** AuthService (register with hashed password via bcrypt), AuthController (POST /auth/register, POST /auth/login). Use DatabaseModule (Prisma). JWT signing in AuthService.
**Step 4: Run — pass**
**Step 5: Commit** `feat(auth-service): add registration and login`

---

### Task 14: Auth service — JWT refresh and token validation (TCP)

**Files:**
- Modify: `packages/apps/auth-service/src/auth/auth.service.ts` (refresh token issue/validate)
- Create: `packages/apps/auth-service/src/auth/auth.controller.ts` (POST /auth/refresh)
- Create: `packages/apps/auth-service/src/auth/auth-tcp.controller.ts` (TCP listener for `validateToken` message pattern)
- Test: `packages/apps/auth-service/src/auth/auth-tcp.controller.spec.ts`

**Step 1: Failing test** — TCP handler returns user payload when token valid.
**Step 2: Run — fail**
**Step 3: Implement** refresh endpoint; TCP controller with @MessagePattern('validateToken') that verifies JWT and returns user id/email.
**Step 4: Run — pass**
**Step 5: Commit** `feat(auth-service): add refresh and TCP token validation`

---

### Task 15: Auth service — API key CRUD and validation

**Files:**
- Create: `packages/apps/auth-service/src/api-key/api-key.module.ts`, `api-key.service.ts`, `api-key.controller.ts`
- Create: `packages/apps/auth-service/src/api-key/dto/create-api-key.dto.ts`
- Test: `packages/apps/auth-service/src/api-key/api-key.service.spec.ts`

**Step 1–5:** TDD: create/list/revoke API keys (hash stored in DB); TCP or REST endpoint to validate API key and return workspaceId/userId. Commit: `feat(auth-service): add API key management`.

---

## Phase 4: Workspace service

### Task 16: Workspace service bootstrap and TCP

**Files:**
- Create: `packages/apps/workspace-service/package.json`, `project.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`
- Create: `packages/apps/workspace-service/src/workspace/workspace.module.ts`, `workspace.service.ts`, `workspace.controller.ts` (TCP)
- Test: `packages/apps/workspace-service/test/app.e2e-spec.ts`, `src/workspace/workspace.service.spec.ts`

**Step 1: Failing test** — WorkspaceService.findOne(id) returns workspace or null.
**Step 2: Run — fail**
**Step 3: Implement** WorkspaceModule with Prisma; WorkspaceService (findOne, create, update); TCP controller with @MessagePattern for getWorkspace.
**Step 4: Run — pass**
**Step 5: Commit** `feat(workspace-service): bootstrap and workspace CRUD via TCP`

---

### Task 17: Workspace service — members, invitations, RBAC

**Files:**
- Create: `packages/apps/workspace-service/src/member/member.module.ts`, `member.service.ts`, `member.controller.ts` (TCP)
- Create: `packages/apps/workspace-service/src/member/dto/invite-member.dto.ts`
- Test: `packages/apps/workspace-service/src/member/member.service.spec.ts`

**Step 1–5:** TDD: add member, list members, change role, remove member; enforce OWNER/ADMIN for mutations. Commit: `feat(workspace-service): add members and RBAC`.

---

### Task 18: Workspace service — docs/wiki (tree, markdown)

**Files:**
- Create: `packages/apps/workspace-service/src/document/document.module.ts`, `document.service.ts`, `document.controller.ts` (TCP)
- Create: `packages/apps/workspace-service/src/document/dto/create-document.dto.ts`
- Test: `packages/apps/workspace-service/src/document/document.service.spec.ts`

**Step 1–5:** TDD: create document (parentId for tree), get tree, get one, update content, delete. Commit: `feat(workspace-service): add document/wiki CRUD`.

---

### Task 19: Workspace service — audit log

**Files:**
- Create: `packages/apps/workspace-service/src/audit/audit.module.ts`, `audit.service.ts`
- Modify: `packages/apps/workspace-service/src/workspace/workspace.service.ts`, `member.service.ts`, `document.service.ts` — call AuditService on every mutation.
- Test: `packages/apps/workspace-service/src/audit/audit.service.spec.ts`

**Step 1–5:** TDD: AuditService.write(workspaceId, userId, action, resource, resourceId, ip?, userAgent?); call from workspace/member/document services. Commit: `feat(workspace-service): add audit log on mutations`.

---

## Phase 5: Issue service

### Task 20: Issue service bootstrap and issue CRUD (TCP)

**Files:**
- Create: `packages/apps/issue-service/package.json`, `project.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`
- Create: `packages/apps/issue-service/src/issue/issue.module.ts`, `issue.service.ts`, `issue.controller.ts` (TCP)
- Create: `packages/apps/issue-service/src/issue/dto/create-issue.dto.ts`, `update-issue.dto.ts`
- Test: `packages/apps/issue-service/src/issue/issue.service.spec.ts`

**Step 1–5:** TDD: create issue, findMany (with workspaceId filter, pagination), findOne, update, delete. Commit: `feat(issue-service): bootstrap and issue CRUD via TCP`.

---

### Task 21: Issue service — labels, milestones, releases

**Files:**
- Create: `packages/apps/issue-service/src/label/label.module.ts`, `label.service.ts`, `label.controller.ts` (TCP)
- Create: `packages/apps/issue-service/src/milestone/milestone.module.ts`, `milestone.service.ts`, `milestone.controller.ts` (TCP)
- Create: `packages/apps/issue-service/src/release/release.module.ts`, `release.service.ts`, `release.controller.ts` (TCP)
- Test: Unit tests for each service.

**Step 1–5:** TDD each domain. Commit: `feat(issue-service): add labels, milestones, releases`.

---

### Task 22: Issue service — activity feed and BullMQ events

**Files:**
- Create: `packages/apps/issue-service/src/activity/activity.module.ts`, `activity.service.ts`
- Modify: `packages/apps/issue-service/src/issue/issue.service.ts` — after create/update/delete, write Activity and emit BullMQ event (e.g. `issue.updated`).
- Create: `packages/apps/issue-service/src/activity/activity.controller.ts` (TCP: getActivityForEntity)
- Test: `packages/apps/issue-service/src/activity/activity.service.spec.ts`

**Step 1–5:** TDD: ActivityService records entityType, entityId, action, metadata, userId; event payload includes workspaceId, event type, entity id. Commit: `feat(issue-service): add activity feed and event emission`.

---

## Phase 6: Notification service

### Task 23: Notification service — BullMQ consumer and in-app model

**Files:**
- Create: `packages/apps/notification-service/package.json`, `project.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`
- Create: `packages/apps/notification-service/src/notification/notification.module.ts`, `notification.service.ts` (Prisma: Notification model)
- Create: `packages/apps/notification-service/src/notification/notification.processor.ts` (BullMQ @Processor, consumes jobs from queue used by issue-service)
- Test: `packages/apps/notification-service/src/notification/notification.processor.spec.ts` (mock queue, assert Notification created)

**Step 1–5:** TDD: processor receives job (userId, workspaceId, type, title, body), creates Notification row. Commit: `feat(notification-service): add BullMQ consumer and in-app notifications`.

---

### Task 24: Notification service — Redis pub/sub and WebSocket bridge

**Files:**
- Create: `packages/apps/notification-service/src/realtime/realtime.module.ts` — subscribe to Redis channel, forward to local WebSocket gateway (or document contract for gateway to subscribe).
- Design: Gateway will hold WebSocket connections; notification-service publishes to Redis; gateway subscribes and pushes to connected clients. Implement in notification-service: publish to Redis on new notification; gateway task will subscribe.
- Test: Unit test that service publishes expected payload to Redis.

**Step 1–5:** Implement Redis publish on notification create; document channel name and payload. Commit: `feat(notification-service): publish notifications to Redis for realtime`.

---

## Phase 7: Integration service (webhooks)

### Task 25: Integration service — webhook CRUD and BullMQ consumer

**Files:**
- Create: `packages/apps/integration-service/package.json`, `project.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`
- Create: `packages/apps/integration-service/src/webhook/webhook.module.ts`, `webhook.service.ts`, `webhook.controller.ts` (TCP)
- Create: `packages/apps/integration-service/src/webhook/dto/create-webhook.dto.ts`
- Create: `packages/apps/integration-service/src/webhook/webhook.processor.ts` — consumes webhook delivery jobs, HTTP POST to URL with HMAC, exponential backoff, record WebhookDelivery.
- Test: `packages/apps/integration-service/src/webhook/webhook.service.spec.ts`, `webhook.processor.spec.ts`

**Step 1–5:** TDD: create/list/update/delete webhooks; processor sends payload, signs with secret, retries on failure. Commit: `feat(integration-service): add webhook CRUD and delivery processor`.

---

## Phase 8: API Gateway

### Task 26: API Gateway bootstrap — GraphQL and REST, TCP clients

**Files:**
- Create: `packages/apps/api-gateway/package.json`, `project.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`
- Create: `packages/apps/api-gateway/src/auth/auth.module.ts` — register TCP ClientProxy for AUTH_SERVICE, use JwtAuthGuard, ThrottlerGuard.
- Create: `packages/apps/api-gateway/src/health/health.controller.ts` (REST GET /health)
- Test: `packages/apps/api-gateway/test/app.e2e-spec.ts` — GET /health 200.

**Step 1–5:** Bootstrap gateway with CORS, ValidationPipe, TCP clients for auth/workspace/issue; health check. Commit: `feat(api-gateway): bootstrap with TCP clients and health`.

---

### Task 27: API Gateway — GraphQL code-first (workspace, issue)

**Files:**
- Create: `packages/apps/api-gateway/src/workspace/workspace.module.ts`, `workspace.resolver.ts`, `workspace.graphql.ts` (or code-first: resolver uses @Query/@Mutation, DTOs with @ObjectType/@InputType)
- Create: `packages/apps/api-gateway/src/issue/issue.module.ts`, `issue.resolver.ts`
- Resolvers call internal services via ClientProxy (send pattern); map responses to GraphQL types.

**Step 1: E2E test** — GraphQL query workspace by id returns workspace.
**Step 2: Run — fail**
**Step 3: Implement** code-first GraphQL (Apollo), WorkspaceResolver, IssueResolver proxying to workspace-service and issue-service.
**Step 4: Run — pass**
**Step 5: Commit** `feat(api-gateway): add GraphQL resolvers for workspace and issue`

---

### Task 28: API Gateway — REST webhooks and middleware

**Files:**
- Create: `packages/apps/api-gateway/src/webhook/webhook.controller.ts` (REST: register webhook URL — delegates to integration-service via TCP or HTTP)
- Create: `packages/apps/api-gateway/src/middleware/correlation-id.middleware.ts`, `request-logger.middleware.ts`
- Add TenantInterceptor (from common), LoggingInterceptor; apply AllExceptionsFilter, PrismaExceptionFilter.

**Step 1–5:** Implement REST endpoints for webhook registration; add middleware and interceptors. Commit: `feat(api-gateway): add REST webhooks and middleware`.

---

### Task 29: API Gateway — WebSocket gateway and Redis adapter

**Files:**
- Create: `packages/apps/api-gateway/src/realtime/realtime.gateway.ts` (WebSocket gateway)
- Use Redis adapter so multiple gateway instances receive same events; subscribe to Redis channel from notification-service and emit to room (e.g. by userId or workspaceId).
- Test: E2E or unit that gateway emits to client when Redis message received.

**Step 1–5:** Implement WebSocket gateway, Redis adapter, subscription to notification channel; emit to user/workspace rooms. Commit: `feat(api-gateway): add WebSocket gateway with Redis adapter`.

---

## Phase 9: Docker and CI

### Task 30: Docker — Dockerfile and docker-compose

**Files:**
- Create: `docker/Dockerfile` (multi-stage: build then production with node)
- Create: `docker/docker-compose.yml` — PostgreSQL, Redis, api-gateway, auth-service, workspace-service, issue-service, notification-service, integration-service; healthchecks; env from .env.
- Create: `.env.example` at root with all required vars (DATABASE_URL, REDIS_URL, JWT_SECRET, etc.).

**Step 1: Verify** — `docker compose -f docker/docker-compose.yml config` succeeds.
**Step 2: Build** — build each app image (reference Dockerfile with build context for each app).
**Step 3: Up** — `docker compose up -d` and healthchecks pass.
**Step 4: Commit** `chore(docker): add Dockerfile and docker-compose for all services`

---

### Task 31: CI — GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml` — lint (e.g. eslint), typecheck (nx run-many typecheck), test (nx run-many test), build (nx run-many build --all or nx affected), Prisma migrate check (validate schema/generate), optional Docker build per app.

**Step 1: Push branch and run workflow**
**Step 2: Fix any failures**
**Step 3: Commit** `chore(ci): add GitHub Actions lint, typecheck, test, build, migrate check`

---

## Execution summary

- **Total tasks:** 31 (foundation → libs → auth → workspace → issue → notification → integration → gateway → Docker/CI).
- **Order:** Execute in task order; Phase 2 libs can be parallelized internally; services depend on database and config.
- **Testing:** Each task includes run commands and expected pass/fail. Use `nx run <project>:test` and `nx run <project>:e2e` as applicable.
- **Docs:** Keep @docs/plans/2026-03-10-saas-platform-design.md as the architecture reference; this file is the implementation checklist.

After completing the plan, run a final verification: `nx run-many -t typecheck test build`, then `docker compose -f docker/docker-compose.yml up -d` and smoke-test gateway health and one GraphQL query.

---

## Execution handoff

**Plan complete and saved to `docs/plans/2026-03-10-saas-platform-implementation.md`.**

Two execution options:

1. **Subagent-Driven (this session)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Parallel Session (separate)** — Open a new session with **executing-plans**, batch execution with checkpoints.

**Which approach?**

- If **Subagent-Driven** is chosen: use **superpowers:subagent-driven-development** in this session (fresh subagent per task + code review).
- If **Parallel Session** is chosen: open a new session in the worktree and use **superpowers:executing-plans** there.
