# DMS

[![CI](https://github.com/acevedo-daniel/dms-demo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/acevedo-daniel/dms-demo/actions/workflows/ci.yml)

> A focused workspace for coordinating the daily operation of a dental practice.

DMS brings appointments, patient records, treatment context, and operational notes into one calm, connected workspace. The public experience uses Atelier Dental, a fictional practice created to show how the main workflows fit together. Every practice, person, and record in this repository is fictional.

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

## What the workspace covers

- **Appointment coordination:** Create, reschedule, confirm, complete, or cancel appointments while preventing conflicting active slots.
- **Clinical flow controls:** Mark patients as arrived, filter the schedule by operatory, open the command menu with Command-K or Control-K, and print a Daily Huddle brief.
- **Patient directory:** Find, add, edit, archive, and review patients within the sample practice.
- **Connected records:** Keep appointment activity, treatment context, and concise operational notes together on each patient record.
- **Guided public access:** Open a server-provisioned demo session without public registration. The fictional dataset can be reset to its curated baseline whenever needed.

## Technical highlights

- **Domain rules stay close to persistence.** Focused services enforce practice ownership, appointment overlap checks, and archive constraints through PostgreSQL-backed queries.
- **The public experience is intentionally bounded.** A deterministic clock and resettable seed keep walkthroughs, screenshots, and tests consistent.
- **Authentication is designed for exploration.** Better Auth provisions a server-side demo identity and protects workspace routes without exposing credentials in the interface.
- **Quality checks cover the important boundaries.** Vitest covers domain rules and PostgreSQL integration; Playwright covers the main workflows and accessibility checks; GitHub Actions runs the full CI pipeline.
- **The workflow is connected end to end.** A Daily Huddle brief, operatory-aware schedule, and arrival lifecycle make the operational story easy to follow.

## Architecture

    Browser -> Next.js App Router -> Better Auth + Zod boundary -> Domain services -> Drizzle ORM -> PostgreSQL

DMS is a modular monolith: server-rendered routes and route handlers compose focused domain services, while Drizzle owns PostgreSQL access and SQL migrations.

## Technology stack

- **Application:** Next.js 16, React 19, TypeScript, and Tailwind CSS v4.
- **UI:** Radix UI primitives and Lucide React.
- **Data and identity:** PostgreSQL, Drizzle ORM, Drizzle Kit, Better Auth, and Zod.
- **Testing and quality:** Vitest, Playwright, @axe-core/playwright, Prettier, and ESLint.
- **Tooling and runtime:** Node.js 24, pnpm 12.3.4, Docker Compose, and GitHub Actions.

## Repository structure

| Path               | Responsibility                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| src/app            | App Router pages, route handlers, metadata, and workspace routes.              |
| src/components     | Product UI, accessible primitives, and client interactions.                    |
| src/lib            | Domain services, validation contracts, authentication, and demo helpers.       |
| src/db and drizzle | Database schema, deterministic seed data, and versioned SQL migrations.        |
| tests              | Unit, PostgreSQL integration, end-to-end, responsive, and accessibility tests. |
| docs               | Product, architecture, development, and testing documentation.                 |

## Local development

Requirements: Node.js 24, pnpm 12.3.4, and Docker Desktop.

    # Clone and configure the project
    git clone https://github.com/acevedo-daniel/dms-demo.git
    cd dms-demo
    cp .env.example .env

    # Install dependencies
    pnpm install

    # Start local PostgreSQL
    docker compose up -d

    # Apply migrations and load the deterministic sample data
    pnpm db:reset

    # Start the development server
    pnpm dev

Open [http://localhost:3000](http://localhost:3000) and choose **Explore demo**. The sample environment is fictional and resettable.

## Quality checks

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

The CI workflow runs these checks with Node.js 24, pnpm 12.3.4, and an isolated PostgreSQL service.

## Documentation

- [Project scope](docs/PROJECT.md) — product scope, domain rules, and constraints.
- [Architecture](docs/ARCHITECTURE.md) — system topology, boundaries, and invariants.
- [Development](docs/DEVELOPMENT.md) — local requirements, environment setup, and database workflow.
- [Testing](docs/TESTING.md) — test layers, commands, and release gates.
- [Security policy](.github/SECURITY.md) — private vulnerability reporting and demo-data guidance.
