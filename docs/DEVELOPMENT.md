# DMS — Development

> Developer environment setup, database commands, and workflow guide for DMS.

## Requirements

| Tool    | Version   | Source                                         |
| ------- | --------- | ---------------------------------------------- |
| Node.js | >= 24.0.0 | `.nvmrc`                                       |
| pnpm    | >= 10.0.0 | `package.json` (`packageManager`)              |
| Docker  | Latest    | Docker Desktop / OrbStack for local PostgreSQL |

## Setup

```bash
# Clone the repository
git clone https://github.com/acevedo-daniel/dms-demo.git
cd dms-demo

# Copy environment variables
cp .env.example .env

# Install dependencies
pnpm install

# Start local PostgreSQL container
docker compose up -d

# Initialize migrations and seed deterministic sample data
pnpm db:reset
```

## Local environment

| Variable             | Required | Purpose                                                                                      |
| -------------------- | :------: | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       |   Yes    | PostgreSQL connection string (`postgresql://postgres:postgres@localhost:5432/dms`)           |
| `TEST_DATABASE_URL`  |   Yes    | Test PostgreSQL connection string (`postgresql://postgres:postgres@localhost:5433/dms_test`) |
| `BETTER_AUTH_SECRET` |   Yes    | Cryptographic secret for signing session tokens in local development                         |
| `BETTER_AUTH_URL`    |   Yes    | Local application URL (`http://localhost:3000`)                                              |

Never commit real secrets. The repository is strictly a fictional demonstration.

## Run locally

```bash
# Start development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public home, or [http://localhost:3000/demo/access](http://localhost:3000/demo/access) to access the workspace.

## Commands

| Task              | Command                 | Purpose                                                 |
| ----------------- | ----------------------- | ------------------------------------------------------- |
| Dev server        | `pnpm dev`              | Start Next.js App Router local dev server               |
| Lint              | `pnpm lint`             | Run ESLint across code and components                   |
| Format            | `pnpm format`           | Reformat code using Prettier rules                      |
| Format check      | `pnpm format:check`     | Verify formatting without modifying files               |
| Type check        | `pnpm typecheck`        | Run TypeScript compiler in `--noEmit` mode              |
| Unit tests        | `pnpm test`             | Run Vitest unit tests                                   |
| Test DB Up        | `pnpm db:test:up`       | Start isolated test PostgreSQL Docker container         |
| Integration tests | `pnpm test:integration` | Run PostgreSQL integration tests                        |
| E2E tests         | `pnpm test:e2e`         | Run Playwright end-to-end and WCAG accessibility suites |
| Build             | `pnpm build`            | Compile production Next.js bundle                       |

## Database workflow

```bash
# Run migrations using Drizzle Kit
pnpm db:migrate

# Seed deterministic sample dataset for Atelier Dental
pnpm db:seed

# Complete reset (migrate + seed)
pnpm db:reset
```

## Related documentation

- [README.md](../README.md) — project overview, screenshots, and live demo link.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture, component boundaries, and invariants.
- [TESTING.md](TESTING.md) — test layers and CI verification.
- [PROJECT.md](PROJECT.md) — product scope and clinical business rules.
