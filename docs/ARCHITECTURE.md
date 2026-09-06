# DMS — Architecture

> System topology, component boundaries, and technical invariants for DMS.

## Summary

DMS is a modular monolith built with the Next.js App Router, React Server Components, Better Auth, and Drizzle ORM backed by PostgreSQL. Domain rules live in focused services under src/lib, while route handlers and UI components remain responsible for transport and presentation.

    Browser -> Next.js App Router -> Better Auth / Zod boundary
            -> Domain services (src/lib) -> Drizzle ORM -> PostgreSQL

## Component boundaries

| Component      | Owns                                                                                               | Boundary                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| src/app        | Route layout, metadata, HTTP handlers, and streaming boundaries                                    | Must not write raw SQL or bypass service validation.                       |
| src/components | UI presentation, accessible primitives, sheets, dialogs, and client interactions                   | Must not issue direct database queries.                                    |
| src/lib        | Domain logic, validation, authentication, demo helpers, conflict checks, and service orchestration | Must not depend on React hooks or presentation details.                    |
| src/db         | Database connection, schema declarations, and deterministic seed data                              | Must not define application workflow policies.                             |
| drizzle        | Versioned SQL migrations and migration metadata                                                    | Must reflect schema history and remain synchronized with src/db/schema.ts. |

## Data and persistence

- **ORM:** Drizzle ORM with the standard PostgreSQL connection pool through pg.
- **Schema:** Defined in src/db/schema.ts with foreign keys, indexes, and practice-scoped queries.
- **Migrations:** Versioned SQL files in drizzle/, managed through Drizzle Kit.
- **Seed:** A deterministic dataset created through pnpm db:seed, covering Atelier Dental appointments, patients, treatments, and operational notes.

## Hosted topology

- **Web and API:** Next.js deployed to Vercel using the Node.js server runtime.
- **Database:** A PostgreSQL service connected through DATABASE_URL.
- **Session layer:** Better Auth backed by database session records in the session table.

## Invariants

- **Practice isolation:** Every operational entity, patients, treatments, appointments, and patient_notes, belongs to a practiceId.
- **No active overlaps:** SCHEDULED and CONFIRMED appointments cannot overlap within the same practice.
- **Archive safety:** Patients cannot be permanently deleted, and archiving is blocked when future active appointments remain.
- **Deterministic time:** Public demo views use a fixed practice baseline of Tuesday, 12 May 2026 so screenshots, tests, and walkthroughs remain reproducible.
- **Privacy boundary:** The repository contains no real patient health information and does not include third-party tracking scripts.

## Trade-offs

### Modular monolith instead of microservices

- **Choice:** One Next.js application contains the UI, route handlers, and domain services.
- **Rationale:** This keeps operations simple, preserves transactional integrity, and allows type-safe contracts without RPC overhead.

### Server-first rendering instead of a global client store

- **Choice:** Server-rendered routes use React Server Components; client state stays close to individual forms and dialogs.
- **Rationale:** This avoids a heavyweight state library while keeping first render, data ownership, and accessibility straightforward.

## Related documentation

- [README.md](../README.md) — project entry point and local setup.
- [PROJECT.md](PROJECT.md) — product scope and business rules.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local workflow and environment configuration.
- [TESTING.md](TESTING.md) — test layers and verification commands.
