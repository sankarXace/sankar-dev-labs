# SaaS Developer Workflow Platform — Architecture Design

## Overview

A Linear + Notion-style developer workflow platform built as an Nx monorepo with NestJS microservices. Learning/portfolio project demonstrating comprehensive NestJS patterns, microservices architecture, and modern backend tooling.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Microservices | True service isolation, independently deployable, demonstrates NestJS microservices patterns |
| Inter-service sync | NestJS TCP transport | Built-in, uses @MessagePattern/@EventPattern, minimal setup |
| Inter-service async | BullMQ (Redis) | Reliable job queues for notifications, webhooks, activity feeds |
| Multi-tenancy | Shared DB, tenant column | Simplest ops, Prisma-friendly, workspace_id on every tenant-scoped table |
| Monorepo layout | packages/apps/ + packages/libs/ | Works with existing npm workspaces config, clean separation |
| API | GraphQL (code-first) + REST | GraphQL for client flexibility, REST for webhooks/simple endpoints |
| ORM | Prisma | Type-safe, great migration story, single schema in shared lib |

## Folder Structure

```
sankar-dev-labs/
├── packages/
│   ├── apps/
│   │   ├── api-gateway/          # Public-facing: GraphQL + REST + WebSocket
│   │   ├── auth-service/         # JWT auth, sessions, API keys
│   │   ├── workspace-service/    # Tenants, members, RBAC, docs/wiki
│   │   ├── issue-service/        # Issues, labels, releases, activity feeds
│   │   ├── notification-service/ # Email, push, in-app notifications
│   │   └── integration-service/  # Webhook management, external integrations
│   └── libs/
│       ├── database/             # Prisma schema, client, migrations, seeds
│       ├── auth/                 # JWT strategy, guards, decorators
│       ├── common/               # Base entities, pagination, error classes
│       ├── config/               # Validated env config per service
│       ├── messaging/            # BullMQ producers/consumers, Redis pub/sub
│       ├── logger/               # Structured logger (pino), request context
│       ├── dto/                  # Shared DTOs, GraphQL input types
│       ├── interfaces/           # TypeScript interfaces, enums, constants
│       └── permissions/          # RBAC roles, permission checks, policy engine
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
├── .github/workflows/ci.yml
├── nx.json
└── package.json
```

Each app internal structure:
```
apps/<service>/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── <domain>/
│   │   ├── <domain>.module.ts
│   │   ├── <domain>.service.ts
│   │   ├── <domain>.controller.ts (or .resolver.ts)
│   │   └── <domain>.service.spec.ts
│   └── middleware/
├── test/
│   └── app.e2e-spec.ts
├── project.json
├── tsconfig.json
└── package.json
```

## Service Responsibilities

### API Gateway
- Only public-facing service. Exposes GraphQL (code-first, Apollo) and REST (Swagger) endpoints.
- Proxies to internal services via NestJS TCP ClientProxy.
- Handles: rate limiting (ThrottlerGuard), CORS, request validation (ValidationPipe), JWT verification, WebSocket gateway for real-time.
- No business logic — pure routing/orchestration.

### Auth Service
- User registration, login, password reset, API key management.
- Issues JWTs (access + refresh), stores sessions in Redis.
- TCP listener for token validation from gateway.

### Workspace Service
- CRUD for workspaces (tenants), member invitations, role assignment.
- Documentation/wiki pages (tree-structured, markdown content).
- Audit log writes on every mutation.

### Issue Service
- Issues, labels, milestones, release management, activity feeds.
- Every issue mutation emits event via BullMQ to notification/integration services.

### Notification Service
- BullMQ consumer for notification jobs (email, in-app, push).
- Redis pub/sub bridge to push real-time notifications via gateway WebSocket.

### Integration Service
- Webhook CRUD (register URLs, secrets, event subscriptions).
- BullMQ consumer: dispatches webhook payloads with HMAC signing and exponential backoff retries.

## Communication Flow

```
Client → API Gateway (GraphQL/REST/WS)
              ↓ TCP (sync)
    Auth / Workspace / Issue services
              ↓ BullMQ (async events)
    Notification / Integration services
```

## Data Model (Prisma)

Single schema in `libs/database/prisma/schema.prisma`. All tenant-scoped tables have `workspaceId` with composite indexes.

### Models
- **User** — id, email, passwordHash, name, avatarUrl, createdAt
- **Workspace** — id, name, slug, plan, createdAt
- **WorkspaceMember** — userId, workspaceId, role (OWNER/ADMIN/MEMBER/VIEWER)
- **ApiKey** — id, workspaceId, userId, keyHash, name, lastUsedAt, expiresAt
- **Issue** — id, workspaceId, title, description, status, priority, assigneeId, createdById
- **Label** — id, workspaceId, name, color
- **Milestone** — id, workspaceId, title, dueDate, status
- **Release** — id, workspaceId, version, milestoneId, notes, releasedAt
- **Document** — id, workspaceId, parentId (self-ref), title, content, createdById
- **Activity** — id, workspaceId, entityType, entityId, action, metadata (JSON), userId
- **AuditLog** — id, workspaceId, userId, action, resource, resourceId, ipAddress, userAgent
- **Notification** — id, userId, workspaceId, type, title, body, readAt
- **Webhook** — id, workspaceId, url, secret, events[], active
- **WebhookDelivery** — id, webhookId, event, payload, statusCode, responseBody, attempts

## NestJS Patterns Demonstrated

| Concept | Location | Example |
|---------|----------|---------|
| Modules | Every service + lib | AuthModule, DatabaseModule, IssueModule |
| Providers | Services, repositories | IssueService, PrismaService |
| DI | Everywhere | @Inject('AUTH_SERVICE') for TCP ClientProxy |
| Pipes | Gateway, services | ValidationPipe (global), WorkspaceIdPipe |
| Guards | Auth lib | JwtAuthGuard, RolesGuard, ApiKeyGuard, ThrottlerGuard |
| Interceptors | Common lib | TenantInterceptor, LoggingInterceptor, CacheInterceptor |
| Filters | Common lib | AllExceptionsFilter, PrismaExceptionFilter |
| Middleware | Gateway | CorrelationIdMiddleware, RequestLoggerMiddleware |
| Custom decorators | Auth lib | @CurrentUser(), @Roles(), @Public(), @WorkspaceId() |

## DevOps

### Docker
- Multi-stage Dockerfile: build (install + compile) → production (dist + node).
- docker-compose.yml: all 6 services + PostgreSQL + Redis with healthchecks.
- Named profiles for running service subsets.

### Environment Config
- `libs/config` with @nestjs/config + Joi validation per service.
- `.env.example` at root, each service loads only its required vars.

### Migrations & Seeds
- Prisma migrations in `libs/database/prisma/migrations/`.
- Seed script creates demo workspace, admin user, sample issues/docs.
- Nx targets: `nx run database:migrate`, `nx run database:seed`.

### CI/CD
- GitHub Actions: Lint → Typecheck → Test → Build (nx affected).
- Docker image build per app.
- Prisma migration check.

## Testing

- **Unit tests**: Jest, per-service. Services/guards/pipes tested in isolation with mocks. `src/**/*.spec.ts`.
- **E2E tests**: Supertest against API gateway with test DB. `test/*.e2e-spec.ts`. Uses @nestjs/testing.

## Scalability Strategies

- **Stateless services**: no local state, horizontal scaling behind load balancer.
- **Redis caching**: CacheInterceptor with TTL-based invalidation for hot data.
- **BullMQ async**: Heavy ops (notifications, webhooks) processed via queues, workers scale independently.
- **Database**: composite indexes on (workspaceId, ...), connection pooling, read replicas as future option.
- **WebSocket**: Redis adapter for multi-instance fan-out.
