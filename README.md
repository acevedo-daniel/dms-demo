# DMS

[![CI](https://github.com/acevedo-daniel/dms-demo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/acevedo-daniel/dms-demo/actions/workflows/ci.yml)

> A calm, focused workspace for coordinating daily dental practice operations.

DMS brings appointments, patient records, treatment context, and operational notes into one cohesive surface. The public experience is anchored in Atelier Dental—a curated, fictional practice designed to show how real clinical workflows fit together throughout the day. Every practice, patient, and clinical note in this repository is strictly fictional.

**[Explore the live demo](https://dms-showcase.vercel.app)**

## Screenshots

### Public introduction

![DMS public introduction to the dental practice workspace](docs/screenshots/public-home.webp)

### Enter and orient

| Demo access                                                                                             | Today dashboard                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![DMS demo access screen for the fictional Atelier Dental workspace](docs/screenshots/demo-access.webp) | ![DMS Today dashboard with appointments, follow-up work, and recent notes](docs/screenshots/today.webp) |

### Core workflows

| Weekly schedule                                                                   | Patient record                                                                                              |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![DMS weekly schedule for the fictional practice](docs/screenshots/schedule.webp) | ![DMS patient record with appointment activity and treatment context](docs/screenshots/patient-record.webp) |

## Key capabilities

- **Schedule coordination:** Book, reschedule, confirm, complete, or cancel appointments with strict conflict prevention per operatory.
- **Reception and clinical flow:** Record patient arrivals in real time, filter the schedule by chair, navigate via Command-K / Control-K, and print a clean Daily Huddle briefing.
- **Connected patient records:** Maintain patient profiles with medical alerts, timing preferences, contact details, and chronological visit histories.
- **Treatment context & notes:** Reference standardized treatment protocols with duration baselines and record succinct clinical observations.
- **Frictionless demo access:** Step into an active practice session provisioned on the server with zero sign-up required, fully resettable to its baseline at any moment.

## Engineering highlights

- **Domain rules stay close to persistence.** Practice ownership, operatory conflict prevention, and archive safety invariants are enforced within PostgreSQL-backed service boundaries.
- **Deterministic clock and baseline dataset.** A fixed reference time (Tuesday, May 12, 2026) and a reproducible seed guarantee that screenshots, walkthroughs, and automated tests always reflect a consistent state.
- **Exploration-first authentication.** Better Auth provisions isolated server-side demo sessions, securing workspace routes without exposing credentials in the client.
- **Multi-layered quality gates.** Vitest covers domain logic and isolated PostgreSQL integration; Playwright validates full browser workflows alongside automated WCAG 2.1 AA accessibility audits via AxeBuilder.

## Architecture

```text
Browser -> Next.js App Router -> Better Auth + Zod validation boundary
        -> Domain services (src/lib) -> Drizzle ORM -> PostgreSQL
```

DMS is structured as a modular monolith: React Server Components compose focused domain services, while Drizzle ORM manages typed SQL queries and declarative schema migrations.

## Technology stack

- **Application:** Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.
- **UI primitives:** Radix UI and Lucide React.
- **Data & identity:** PostgreSQL, Drizzle ORM, Drizzle Kit, and Better Auth.
- **Testing & quality:** Vitest, Playwright, @axe-core/playwright, Prettier, and ESLint.
- **Runtime & tooling:** Node.js 24, pnpm 12.3.4, Docker Compose, and GitHub Actions.

## Repository structure

| Path                   | Responsibility                                                                  |
| ---------------------- | ------------------------------------------------------------------------------- |
| `src/app`              | App Router pages, route handlers, metadata, and workspace views.                |
| `src/components`       | Product UI, accessible primitives, and client interactions.                     |
| `src/lib`              | Domain services, validation contracts, authentication, and demo helpers.        |
| `src/db` and `drizzle` | Relational schema, deterministic seed data, and versioned SQL migrations.       |
| `tests`                | Unit, PostgreSQL integration, end-to-end, responsive, and accessibility suites. |
| `docs`                 | Product, architecture, development, and testing documentation.                  |

## Local development

Prerequisites: Node.js 24, pnpm 12.3.4, and Docker Desktop (or equivalent Docker runtime).

```bash
# Clone the repository and configure environment variables
git clone https://github.com/acevedo-daniel/dms-demo.git
cd dms-demo
cp .env.example .env

# Install dependencies
pnpm install

# Start local PostgreSQL container
docker compose up -d

# Apply migrations and load deterministic sample data
pnpm db:reset

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and select **Explore demo**. The demo environment is fictional and can be restored at any point.

## Quality

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm db:test:up
pnpm test:integration
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
pnpm db:test:down
pnpm build
```

The GitHub Actions CI pipeline runs these exact checks on Node.js 24 against an isolated PostgreSQL service container.

## Documentation

- [Project scope](docs/PROJECT.md) — product scope, domain rules, and business constraints.
- [Architecture](docs/ARCHITECTURE.md) — system topology, component boundaries, and invariants.
- [Development](docs/DEVELOPMENT.md) — local environment, database workflow, and command reference.
- [Testing](docs/TESTING.md) — test layers, fixture isolation, and CI verification pipeline.
- [Security policy](.github/SECURITY.md) — private vulnerability reporting and demo-data safety guidelines.
