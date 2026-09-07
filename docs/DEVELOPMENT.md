# DMS: Development

> Developer setup, environment configuration, and daily workflow for DMS.

## Requirements

| Tool    | Version                | Source                                         |
| ------- | ---------------------- | ---------------------------------------------- |
| Node.js | 24.x                   | `.nvmrc` and `package.json` engines            |
| pnpm    | 12.3.4                 | `package.json` packageManager                  |
| Docker  | Current stable release | Docker Desktop or equivalent container runtime |

## Setup

```bash
# Clone the repository
git clone https://github.com/acevedo-daniel/dms-demo.git
cd dms-demo

# Create local environment configuration
cp .env.example .env

# Install dependencies
pnpm install

# Start local PostgreSQL container
docker compose up -d

# Apply database migrations and load deterministic sample data
pnpm db:reset
```

## Local environment

| Variable              | Required | Purpose                                                      |
| --------------------- | :------: | ------------------------------------------------------------ |
| `DATABASE_URL`        |   Yes    | Local PostgreSQL connection string.                          |
| `TEST_DATABASE_URL`   |   Yes    | Isolated integration test database connection string.        |
| `BETTER_AUTH_SECRET`  |   Yes    | Secret key used to sign local session tokens.                |
| `BETTER_AUTH_URL`     |   Yes    | Base URL used by Better Auth in local development.           |
| `DEMO_AUTH_EMAIL`     |   Yes    | Server-side email for the fictional demo identity.           |
| `DEMO_AUTH_PASSWORD`  |   Yes    | Server-side password for the fictional demo identity.        |
| `NEXT_PUBLIC_APP_URL` |   Yes    | Public application URL used for metadata and absolute links. |
| `PLAYWRIGHT_BASE_URL` | E2E only | Base URL used by Playwright during browser test runs.        |

The `.env.example` file contains safe defaults for local development. Never commit real credentials or production secrets.

## Run locally

```bash
# Start the Next.js development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public landing page, or [http://localhost:3000/demo/access](http://localhost:3000/demo/access) to enter the demo workspace directly.

## Commands

| Task               | Command                 | Purpose                                                     |
| ------------------ | ----------------------- | ----------------------------------------------------------- |
| Development server | `pnpm dev`              | Starts Next.js development server with hot reload.          |
| Production build   | `pnpm build`            | Compiles and optimizes the application for production.      |
| Production server  | `pnpm start`            | Runs the compiled production build locally.                 |
| Format             | `pnpm format`           | Formats all project files using Prettier.                   |
| Format check       | `pnpm format:check`     | Validates formatting without altering files.                |
| Lint               | `pnpm lint`             | Runs ESLint across the codebase.                            |
| Type check         | `pnpm typecheck`        | Validates TypeScript types without emitting build files.    |
| Unit tests         | `pnpm test`             | Runs the Vitest unit test suite.                            |
| Test database up   | `pnpm db:test:up`       | Starts the isolated PostgreSQL test container.              |
| Test database down | `pnpm db:test:down`     | Stops the isolated PostgreSQL test container.               |
| Integration tests  | `pnpm test:integration` | Runs PostgreSQL integration tests against Docker.           |
| E2E tests          | `pnpm test:e2e`         | Runs Playwright browser workflows and accessibility audits. |

## Database workflow

```bash
# Apply pending SQL migrations
pnpm db:migrate

# Load deterministic sample dataset
pnpm db:seed

# Apply migrations and reload sample data
pnpm db:reset
```

The demo seed dataset is deterministic and immutable. Whenever exploratory testing modifies data, running `pnpm db:reset` cleanly restores the baseline expected by automated tests and screenshots.

## Related documentation

- [README.md](../README.md): project overview, live demo link, and local setup.
- [ARCHITECTURE.md](ARCHITECTURE.md): architecture, component boundaries, and invariants.
- [TESTING.md](TESTING.md): test layers, fixture isolation, and CI verification pipeline.
- [PROJECT.md](PROJECT.md): product scope, domain rules, and business constraints.
