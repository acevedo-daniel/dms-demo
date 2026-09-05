# DMS — Architecture

> Architectural topology, component boundaries, and technical invariants for the DMS demo workspace.

## Summary

DMS is a modular monolith designed around Next.js App Router, React Server Components, Better Auth, and Drizzle ORM backed by PostgreSQL. It enforces strong domain boundaries in the service layer (`src/lib`) while keeping data persistence close to domain rules.

```text
Browser -> Next.js App Router (RSC + Client Components) -> Better Auth / Zod Boundary -> Domain Services (src/lib) -> Drizzle ORM -> PostgreSQL
```

## Component boundaries

| Component          | Owns                                                                     | Boundary                                                       |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `src/app`          | Route layout, metadata, HTTP handlers, and streaming boundaries          | Must not write raw SQL or bypass service validation            |
| `src/components`   | UI presentation, accessible primitives (Radix), sheets, and dialogs      | Must not contain direct database queries                       |
| `src/lib/services` | Domain logic, practice rules, conflict checks, and service orchestration | Must not leak React-specific hooks or server-action primitives |
| `src/db`           | Database connection, schema declarations, and deterministic seed         | Must not implement business/workflow policies directly         |

## Data and persistence

- **ORM:** Drizzle ORM with standard PostgreSQL connection pool (`pg` driver).
- **Schema:** Defined in `src/db/schema.ts` with explicit foreign-key cascades and indexes for practice/patient queries.
- **Migrations:** Managed versioned SQL migrations located in `drizzle/` directory via `drizzle-kit`.
- **Seed:** Deterministic dataset generated via `pnpm db:seed` covering appointments, patients, catalog treatments, and operational notes for Atelier Dental.

## Hosted topology

- **Web / API:** Next.js deployed to Vercel (Edge network + Node.js serverless runtime).
- **Database:** Serverless PostgreSQL instance (Neon / Vercel Postgres) connected via connection pooling.
- **Session Layer:** Better Auth backed by database session records (`session` table).

## Invariants

- **Practice Isolation:** Every data entity (`patients`, `treatments`, `appointments`, `patient_notes`) belongs to a `practiceId`.
- **No Overlapping Active Appointments:** Appointments with status `SCHEDULED` or `CONFIRMED` within the practice must not overlap in time.
- **Soft Deletion & Archive Invariant:** Patients cannot be permanently deleted; archiving is blocked if the patient has future active appointments.
- **Deterministic Demo Clock:** Public demo views anchor time against a fixed practice baseline (`Tuesday, 12 May 2026`) to ensure reproducible screenshots, tests, and walkthroughs.
- **Strict Privacy Boundary:** Absolutely zero real Patient Health Information (PHI) or third-party tracking scripts.

## Trade-offs

### Modular Monolith vs. Microservices

- **Choice:** Single Next.js application containing both front-end and domain services.
- **Rationale:** Minimizes operational complexity, simplifies transactional integrity, and enables atomic type-safe contracts without RPC boilerplate.

### Server Components vs. Client State Framework

- **Choice:** Server-first architecture with React 19 server components; client state localized to individual forms/sheets.
- **Rationale:** Avoids heavyweight state libraries (Redux, Zustand) and maximizes first-paint performance and accessible SSR.

## Related documentation

- [README.md](../README.md) — project entry point, architecture, and local development.
- [PROJECT.md](PROJECT.md) — product scope and domain business rules.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local setup, developer workflow, and environment config.
- [TESTING.md](TESTING.md) — testing strategy, test layers, and verification commands.
