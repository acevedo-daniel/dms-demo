# DMS — Testing

> Verification strategy, test layers, and release quality gates for DMS.

## Strategy

DMS uses four complementary layers of automated verification:

1. **Unit tests** verify domain rules, schedule calculations, and contract validation schemas without external I/O or network dependencies.
2. **Integration tests** verify real PostgreSQL queries, relational integrity, constraints, transactions, and migration consistency against an isolated Docker container.
3. **End-to-end tests** verify full user interactions in Chromium via Playwright, covering the unauthenticated public entry, server-side demo provisioning, and workspace flows.
4. **Accessibility, responsive, and localization audits** run through Playwright using AxeBuilder (WCAG 2.1 AA), a multi-breakpoint viewport matrix, and dynamic language toggling.

## Test layers

| Layer         | Purpose                                                                            | Tool and location                                  |
| ------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| Unit          | Domain logic, calendar calculations, and contract schemas.                         | Vitest (`src/**/*.test.ts`)                        |
| Integration   | PostgreSQL queries, foreign keys, constraints, and seed behavior.                  | Vitest + Docker (`tests/integration/`)             |
| E2E           | Public entry, demo access, workspace workflows, and recovery states.               | Playwright (`tests/e2e/demo-workspace.spec.ts`)    |
| Accessibility | Automated WCAG 2.1 AA compliance audits on key routes.                             | AxeBuilder (`tests/e2e/accessibility.spec.ts`)     |
| Responsive    | Layout stability across mobile (390px, 430px) and desktop (1280px, 1440px) widths. | Playwright (`tests/e2e/responsive-matrix.spec.ts`) |
| Localization  | Spanish default language persistence and dynamic English toggle.                   | Playwright (`tests/e2e/i18n-toggle.spec.ts`)       |

## Test data and dependencies

Integration tests run against the isolated PostgreSQL container defined in `compose.test.yaml`. It operates independently from the local development database to prevent test fixtures or teardown steps from disturbing local state.

```bash
# Start isolated PostgreSQL test database
pnpm db:test:up

# Apply integration migrations and run the test suite
pnpm test:integration

# Stop the test database
pnpm db:test:down
```

The test environment uses the exact same deterministic dataset as the application seed, ensuring that dates, statuses, IDs, and assertions remain stable.

## Run tests

```bash
# Fast checks: formatting, linting, types, and unit tests
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test

# Database-backed integration tests
pnpm db:test:up
pnpm test:integration
pnpm db:test:down

# Browser-driven end-to-end and accessibility checks
pnpm exec playwright install --with-deps chromium
pnpm test:e2e

# Production build verification
pnpm build
```

## CI pipeline

Every pull request and push to `main` triggers `.github/workflows/ci.yml`. The automated pipeline:

1. Provisions the runtime using Node.js 24 and pnpm 12.3.4.
2. Validates code formatting with Prettier and runs ESLint.
3. Checks TypeScript types without emitting build output.
4. Executes unit tests with Vitest.
5. Starts an isolated PostgreSQL container service and runs integration tests.
6. Installs Chromium and executes Playwright E2E, accessibility, responsive, and localization suites.
7. Compiles the production build to ensure bundle correctness.

## Related documentation

- [README.md](../README.md) — project overview, live demo link, and local setup.
- [PROJECT.md](PROJECT.md) — product scope, domain rules, and business constraints.
- [ARCHITECTURE.md](ARCHITECTURE.md) — system topology, component boundaries, and invariants.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local setup, environment configuration, and database workflow.
