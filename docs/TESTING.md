# DMS — Testing

> Verification strategy, test commands, and release gates for DMS.

## Strategy

DMS uses four complementary checks:

1. **Unit tests** verify domain calculations, validation contracts, and scheduling behavior without external I/O.
2. **Integration tests** verify real PostgreSQL queries, Drizzle relations, transactions, constraints, migrations, and the deterministic seed.
3. **End-to-end tests** verify real browser workflows in Chromium through Playwright.
4. **Accessibility and responsive checks** run through Playwright with AxeBuilder and a multi-viewport matrix.

## Test layers

| Layer         | Purpose                                                             | Tool or location                                 |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------ |
| Unit          | Domain rules, schedule calculations, and contract validation        | Vitest (src/**/*.test.ts)                        |
| Integration   | PostgreSQL queries, foreign keys, constraints, and seed behavior    | Vitest + Docker (tests/integration/)             |
| E2E           | Public entry, demo access, workspace workflows, and recovery states | Playwright (tests/e2e/)                          |
| Accessibility | Automated WCAG 2.1 AA checks on public and workspace routes         | AxeBuilder (tests/e2e/accessibility.spec.ts)     |
| Responsive    | Key flows across mobile and desktop viewport sizes                  | Playwright (tests/e2e/responsive-matrix.spec.ts) |
| Localization  | Spanish default language and English/Spanish interface behavior     | Playwright (tests/e2e/i18n-toggle.spec.ts)       |

## Test database isolation

Integration tests use the PostgreSQL container defined in compose.test.yaml. It runs separately from the local development database so test migrations and data cannot alter local work.

    # Start the isolated test database
    pnpm db:test:up

    # Apply integration migrations and run the suite
    pnpm test:integration

    # Stop the test database
    pnpm db:test:down

The test environment uses the same deterministic fictional dataset as the application seed. This keeps dates, statuses, relationships, and expected assertions stable.

## Run the checks

    # Fast quality checks
    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test

    # Database-backed checks
    pnpm db:test:up
    pnpm test:integration
    pnpm db:test:down

    # Browser checks
    pnpm exec playwright install --with-deps chromium
    pnpm test:e2e

    # Production verification
    pnpm build

The E2E command expects the configured application URL and test database variables. Check .env.example and playwright.config.ts before running the suite locally.

## CI pipeline

Every pull request and every push to main triggers .github/workflows/ci.yml. The workflow:

1. Installs dependencies with Node.js 24 and pnpm 12.3.4.
2. Runs formatting, linting, type checking, and unit tests.
3. Applies integration migrations and runs PostgreSQL integration tests.
4. Installs Chromium and runs Playwright E2E, accessibility, responsive, and localization coverage.
5. Builds the production application.

## Related documentation

- [README.md](../README.md) — project overview and quick start.
- [PROJECT.md](PROJECT.md) — product scope and domain rules.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architectural boundaries and runtime topology.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local setup and development workflow.
