<!-- Generated: 2026-05-03 | Updated: 2026-05-03 -->

# sankar-dev-labs

## Purpose

An Nx monorepo workspace containing various packages and applications, specifically including a Flutter UI course app (`flutter-ui-course`).

## Key Files

| File                  | Description                                     |
| --------------------- | ----------------------------------------------- |
| `package.json`        | Project dependencies, Nx plugins, and scripts   |
| `nx.json`             | Nx workspace configuration                      |
| `pnpm-workspace.yaml` | pnpm workspace definition                       |
| `tsconfig.base.json`  | Base TypeScript configuration for the workspace |

## Subdirectories

| Directory  | Purpose                                                     |
| ---------- | ----------------------------------------------------------- |
| `apps/`    | Applications, including Flutter apps (see `apps/AGENTS.md`) |
| `.github/` | GitHub workflows for CI/CD (see `.github/AGENTS.md`)        |
| `.vscode/` | VSCode extensions and settings (see `.vscode/AGENTS.md`)    |
| `.claude/` | Claude specific configuration (see `.claude/AGENTS.md`)     |
| `.gemini/` | Gemini specific configuration (see `.gemini/AGENTS.md`)     |

## For AI Agents

### Working In This Directory

- Use `pnpm` for dependency management.
- Always run Nx commands via `npx nx`.
- Add new global packages with `pnpm add -w <package>`.

### Testing Requirements

- Run tests via `npx nx run-many -t test`.
- Run typecheck and lint before committing.

### Common Patterns

- Centralized configuration with Nx and pnpm workspaces.
- TypeScript strict mode enabled across the monorepo.

## Dependencies

### Internal

- N/A (Root)

### External

- Nx
- pnpm

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->

# Agent Guidelines for sankar-dev-labs

## Build/Lint/Test Commands

### Root Workspace (Nx Monorepo)

- **Install dependencies**: `pnpm install`
- **Run all tests**: `npx nx run-many -t test`
- **Run single test**: `npx nx test <project-name>` (e.g., `npx nx test flutter-ui-course`)
- **Run lint**: `npx nx run-many -t lint` or `npx nx lint <project-name>`
- **Type check**: `npx nx run-many -t typecheck`
- **Build**: `npx nx run-many -t build`
- **Format code**: `npx nx format:write` or `npx nx format:write <project-name>`

### TypeScript Packages

- **Typecheck**: `npx nx typecheck <package-name>` (see `tsconfig.base.json` for strict mode)
- **Build**: `npx nx build <package-name>`

### Flutter/Dart Projects

Located in `apps/flutter-ui-course/`:

- **Analyze**: `flutter analyze` (from the Flutter project directory)
- **Run on device**: `flutter run` (from the Flutter project directory)
- **Run single test**: `flutter test test/<test-file>.dart`
- **Format code**: `dart format .` (from the Flutter project directory)
- **Pub get**: `flutter pub get` (from the Flutter project directory)

## Code Style Guidelines

### TypeScript

**Imports**

- Use `import type { X } from '...'` for type-only imports
- Group imports: external packages, internal modules, relative imports
- No unused imports (`noUnusedLocals: true` in tsconfig)

**Formatting**

- Prettier with single quotes
- Trailing commas where valid in ES5
- Run `npx nx format:write` before committing

**Types**

- Strict mode enabled (`strict: true` in tsconfig.base.json)
- No implicit returns (`noImplicitReturns: true`)
- No fallthrough cases in switch (`noFallthroughCasesInSwitch: true`)
- No implicit override (`noImplicitOverride: true`)
- Always use explicit return types on functions

**Naming Conventions**

- `camelCase` for variables, functions, and properties
- `PascalCase` for classes, interfaces, and types
- `SCREAMING_SNAKE_CASE` for constants
- Prefix private members with `#` or `_`

**Error Handling**

- Use explicit error handling with try/catch for async operations
- Create custom error classes extending `Error` for domain errors
- Never throw strings; always throw Error objects

### Dart/Flutter

**Imports**

- Use `package:` imports for external packages
- Use relative imports for local files (`./...`)
- Sort imports alphabetically

**Formatting**

- Follow `flutter_lints` package rules
- Run `dart format .` before committing
- 2-space indentation

**Types**

- Use sound null safety (SDK ^3.11.4)
- Prefer `final` over `var` when variable doesn't change
- Use `const` constructors when possible

**Naming Conventions**

- `camelCase` for variables, functions, and methods
- `PascalCase` for classes, enums, and typedefs
- Private members prefixed with underscore `_`

**Widget Guidelines**

- Extract widgets into separate files when complex (>50 lines)
- Use `const` constructors for immutable widgets
- Prefer `StatelessWidget` over `StatefulWidget` when state isn't needed

**Error Handling**

- Use exceptions for errors that shouldn't occur during normal operation
- Handle errors at appropriate level (UI or service layer)

### General

**Commits**

- Use conventional commits format
- Run lint and typecheck before pushing

**Git Workflow**

- Use feature branches for changes
- Run `npx nx run-many -t lint test build typecheck` before pushing
- CI runs `nx fix-ci` for automated fixes

**File Organization**

- TypeScript: `packages/<name>/` with `src/` subdirectory
- Flutter: `apps/<name>/lib/` for Dart source files

**Testing**

- Write tests alongside implementation
- Use descriptive test names
- Test behavior, not implementation details

### Nx Best Practices

- Understand implicit dependencies in `nx.json`
- Use `npx nx show projects` to list available projects
- Use `npx nx graph` to visualize project dependencies
- Prefer affected commands: `npx nx affected:test --base=main`

### Dependency Management

- Use `pnpm` for package management
- Install new packages with `pnpm add -w <package>` for workspace-wide packages
- Install dev dependencies with `pnpm add -Dw <package>`

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
