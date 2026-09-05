# DMS — Testing

> Verification strategy, test suites, and quality release gates for DMS.

## Strategy

DMS enforces confidence through three isolated verification layers:

1. **Unit tests** prove fast domain calculation, Zod contract validation, and scheduling algorithms in isolation without I/O.
2. **Integration tests** prove real PostgreSQL queries, Drizzle relational queries, transactions, and migration consistency against a dedicated Docker container.
3. **End-to-End (E2E) tests** prove real user workflows in headless Chromium via Playwright, paired with `@axe-core/playwright` to automatically enforce WCAG AA accessibility rules.

## Test layers

| Layer         | Purpose                                                      | Tool / location                                    |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Unit          | Domain rules, schedule slot math, schema validation          | Vitest (`src/**/*.test.ts`, `tests/*.test.ts`)     |
| Integration   | PostgreSQL transactional behavior, foreign keys, constraints | Vitest + Docker (`tests/integration/*.test.ts`)    |
| E2E           | Browser workflows, keyboard focus trap, route recovery       | Playwright (`tests/e2e/demo-workspace.spec.ts`)    |
| Accessibility | Automated WCAG 2.1 AA and 2.2 AA audit                       | AxeBuilder (`tests/e2e/accessibility.spec.ts`)     |
| Responsive    | Multi-viewport baseline verification (375px to 1920px)       | Playwright (`tests/e2e/responsive-matrix.spec.ts`) |

## Test data and dependencies

### Test database isolation

Integration tests run against an isolated PostgreSQL container configured in `compose.test.yaml`, preventing interference with the local development database:

```bash
# Start test database container
pnpm db:test:up

# Run PostgreSQL integration suite
pnpm test:integration

# Stop test database container
pnpm db:test:down
```

### Deterministic seed

The test environment uses the exact deterministic fictional seed (`pnpm db:seed`), ensuring zero stochastic test failures due to random mock timestamps.

## Run tests

```bash
# Run unit tests
pnpm test

# Run unit tests with watch mode
pnpm test:watch

# Run integration tests (requires docker)
pnpm test:integration

# Run end-to-end tests (requires local server or webServer config)
pnpm test:e2e

# Run all quality checks (format, lint, typecheck, unit tests)
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

## CI pipeline

Every pull request and push to `main` triggers GitHub Actions (`.github/workflows/ci.yml`), executing:

1. `pnpm format:check`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`

## Related documentation

- [README.md](../README.md) — project overview, screenshots, and live demo link.
- [PROJECT.md](PROJECT.md) — product scope and clinical business rules.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architectural boundaries and runtime topology.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local setup and development workflow.
