# DMS — Development

> Developer setup, database commands, and the day-to-day workflow for DMS.

## Requirements

| Tool    | Version                | Source                                         |
| ------- | ---------------------- | ---------------------------------------------- |
| Node.js | 24.x                   | .nvmrc and package.json engines                |
| pnpm    | 12.3.4                 | package.json packageManager                    |
| Docker  | Current stable release | Docker Desktop or an equivalent Docker runtime |

## Setup

    # Clone the repository
    git clone https://github.com/acevedo-daniel/dms-demo.git
    cd dms-demo

    # Create the local environment file
    cp .env.example .env

    # Install dependencies
    pnpm install

    # Start the local PostgreSQL container
    docker compose up -d

    # Apply migrations and load the deterministic sample data
    pnpm db:reset

## Local environment

| Variable            | Required | Purpose                                               |
| ------------------- | :------: | ----------------------------------------------------- |
| DATABASE_URL        |   Yes    | Local PostgreSQL connection string.                   |
| TEST_DATABASE_URL   |   Yes    | Isolated integration-test database connection string. |
| BETTER_AUTH_SECRET  |   Yes    | Secret used to sign local session tokens.             |
| BETTER_AUTH_URL     |   Yes    | Base URL used by Better Auth in local development.    |
| DEMO_AUTH_EMAIL     |   Yes    | Server-side email for the fictional demo identity.    |
| DEMO_AUTH_PASSWORD  |   Yes    | Server-side password for the fictional demo identity. |
| NEXT_PUBLIC_APP_URL |   Yes    | Public application URL used by metadata and links.    |
| PLAYWRIGHT_BASE_URL | E2E only | Base URL used by Playwright.                          |

The .env.example file contains safe local defaults. Never commit real secrets or real patient information; the repository is a fictional demonstration.

## Run locally

    # Start the development server
    pnpm dev

Open [http://localhost:3000](http://localhost:3000) for the public entry point, or [http://localhost:3000/demo/access](http://localhost:3000/demo/access) to enter the workspace.

## Commands

| Task               | Command               | Purpose                                            |
| ------------------ | --------------------- | -------------------------------------------------- |
| Development server | pnpm dev              | Start the Next.js development server.              |
| Production build   | pnpm build            | Create the production bundle.                      |
| Production server  | pnpm start            | Serve the built application.                       |
| Formatting         | pnpm format           | Format the repository with Prettier.               |
| Format check       | pnpm format:check     | Verify formatting without changing files.          |
| Lint               | pnpm lint             | Run ESLint across the repository.                  |
| Type check         | pnpm typecheck        | Run TypeScript without emitting files.             |
| Unit tests         | pnpm test             | Run the Vitest unit suite.                         |
| Test database up   | pnpm db:test:up       | Start the isolated PostgreSQL test container.      |
| Test database down | pnpm db:test:down     | Stop the isolated PostgreSQL test container.       |
| Integration tests  | pnpm test:integration | Run PostgreSQL-backed integration tests.           |
| E2E tests          | pnpm test:e2e         | Run Playwright workflows and accessibility checks. |

## Database workflow

    # Apply pending migrations
    pnpm db:migrate

    # Load the deterministic sample data
    pnpm db:seed

    # Apply migrations and reload the sample data
    pnpm db:reset

The demo seed is fictional and deterministic. Reset it after exploratory changes when you need to return to the baseline used by tests and screenshots.

## Related documentation

- [README.md](../README.md) — project overview, capabilities, and quick start.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture, boundaries, and invariants.
- [TESTING.md](TESTING.md) — test layers and CI verification.
- [PROJECT.md](PROJECT.md) — product scope and domain rules.
