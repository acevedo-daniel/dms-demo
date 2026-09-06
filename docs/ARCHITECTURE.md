# DMS — Architecture

> System topology, component boundaries, and technical invariants for DMS.

## Summary

DMS is a modular monolith built with the Next.js App Router, React Server Components, Better Auth, and Drizzle ORM backed by PostgreSQL. Domain rules live in focused services under `src/lib`, while route handlers and UI components remain strictly responsible for transport, presentation, and client interaction.

```text
Browser -> Next.js App Router -> Better Auth / Zod validation boundary
        -> Domain services (src/lib) -> Drizzle ORM -> PostgreSQL
```

## Component boundaries

| Component        | Owns                                                                                                | Boundary                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/app`        | Route layout, metadata, HTTP route handlers, and streaming boundaries.                              | Must not write raw SQL or bypass service-layer validation.                  |
| `src/components` | UI presentation, accessible primitives, panels, dialogs, and interactive client state.              | Must not issue direct database queries or contain business logic.           |
| `src/lib`        | Domain logic, Zod validation contracts, authentication, conflict checks, and service orchestration. | Must not depend on React hooks or visual layout details.                    |
| `src/db`         | Database connection pool, relational schema declarations, and deterministic seed data.              | Must not define workflow policies or interface rules.                       |
| `drizzle`        | Versioned SQL migration files and schema snapshot history.                                          | Must mirror schema history and remain synchronized with `src/db/schema.ts`. |

## Data and persistence

- **ORM:** Drizzle ORM with the standard PostgreSQL connection pool via `pg`.
- **Schema:** Defined in `src/db/schema.ts` with explicit foreign keys, indexes, and queries scoped strictly to `practiceId`.
- **Migrations:** Versioned SQL files in `drizzle/`, generated and applied through Drizzle Kit.
- **Deterministic seed:** Created through `pnpm db:seed`, ensuring that appointments, patients, treatments, and operational notes for Atelier Dental remain fully reproducible.

## Hosted topology

- **Application and API:** Next.js deployed to Vercel using the Node.js server runtime.
- **Database:** A PostgreSQL instance connected via the `DATABASE_URL` environment variable.
- **Session layer:** Better Auth backed by database session records in the `session` table.

## Invariants

- **Practice isolation:** Every operational entity (`patients`, `treatments`, `appointments`, `patient_notes`) strictly belongs to a `practiceId`.
- **No active overlaps per operatory:** `SCHEDULED` and `CONFIRMED` appointments cannot overlap within the same operatory during the same time interval.
- **Archive safety:** Patients cannot be permanently deleted from the database, and archiving is blocked at the service level when future active appointments remain.
- **Deterministic timeline:** Public demo views operate on a fixed practice baseline (Tuesday, May 12, 2026) so screenshots, tests, and guided walkthroughs remain stable across environments.
- **Privacy boundary:** The repository contains no real patient health information (PHI) and avoids all third-party tracking or analytics scripts.

## Trade-offs

### Modular monolith instead of microservices

- **Choice:** A single Next.js application encompasses the interface, route handlers, and domain services.
- **Rationale:** Keeps operational overhead low, guarantees transactional integrity within PostgreSQL, and shares strict end-to-end TypeScript contracts without RPC serialization complexity.

### Server-first rendering instead of a global client store

- **Choice:** Core views are rendered on the server with React Server Components; client state is isolated to individual dialogs, drawers, and form panels.
- **Rationale:** Eliminates heavy client-side synchronization libraries, keeps first-load performance fast, and ensures accessibility remains predictable.

## Related documentation

- [README.md](../README.md) — project entry point, live demo link, and local setup.
- [PROJECT.md](PROJECT.md) — product scope, domain rules, and business constraints.
- [DEVELOPMENT.md](DEVELOPMENT.md) — developer setup, environment variables, and database workflow.
- [TESTING.md](TESTING.md) — test layers, fixture isolation, and CI verification pipeline.
- [SECURITY.md](../.github/SECURITY.md) — private vulnerability reporting and demo-data safety guidelines.
