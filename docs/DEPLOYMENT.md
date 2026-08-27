# Deploying DMS

> Manual configuration guide for the supported DMS portfolio deployment on Vercel and Neon.

This guide prepares a single public demo environment. It does not create provider accounts, deploy the repository, or include secret values. Keep the workspace fictional: do not import patient, client, or production data.

## Production topology

```text
Visitor -> Vercel (Next.js application) -> Neon PostgreSQL
```

| Component         | Platform / target | Responsibility                                                                                                  |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Application       | Vercel            | Builds and serves the Next.js application, public case study, demo access flow, and protected workspace routes. |
| Database          | Neon PostgreSQL   | Stores the provisioned demo identity and the fictional, resettable sample workspace.                            |
| Source and checks | GitHub            | Hosts the repository and runs CI before changes reach the deployment branch.                                    |

## Release flow

```text
Change -> GitHub Actions checks -> merge to main -> Vercel production deployment
```

Vercel detects the Next.js application and the `pnpm` package manager from the repository. No `vercel.json` file or custom output directory is required. Database migrations and the initial demo seed are deliberate operator actions; they are not run during the application build.

## Manual configuration

### 1. Provision the database

1. Create a Neon PostgreSQL project in a region close to the chosen Vercel region.
2. Copy the database connection string from Neon. Use it only as the value of `DATABASE_URL`; do not commit it or place it in screenshots.
3. From a local clone, temporarily set the production values in your shell or an untracked `.env` file, then initialize the database:

```powershell
pnpm db:migrate
pnpm db:seed
```

`pnpm db:seed` intentionally restores the complete fictional baseline. Run it for initial provisioning or when the public demo needs a clean dataset, not as part of every release.

### 2. Create the Vercel project

1. Import the GitHub repository into Vercel.
2. Keep the detected framework preset as **Next.js** and package manager as **pnpm**.
3. Set the production branch to `main`.
4. Choose a canonical public URL, then add the production environment values below before the first deployment.

## Production configuration

| Variable / setting    | Component          | Requirement                                                                                              |
| --------------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Vercel application | Neon connection string for the single demo database. Keep it secret and server-only.                     |
| `BETTER_AUTH_URL`     | Vercel application | Exact canonical HTTPS URL of the deployed application, without a trailing path.                          |
| `BETTER_AUTH_SECRET`  | Vercel application | A unique, high-entropy secret of at least 32 characters. Generate and store it only in Vercel.           |
| `DEMO_AUTH_EMAIL`     | Vercel application | Fictional provisioned demo identity. It must match the identity created by `pnpm db:seed`.               |
| `DEMO_AUTH_PASSWORD`  | Vercel application | Strong server-only password for that fictional identity. It must match the value used by `pnpm db:seed`. |
| `NEXT_PUBLIC_APP_URL` | Vercel application | The same canonical HTTPS URL used by `BETTER_AUTH_URL`; it supplies absolute metadata and sitemap URLs.  |

Do not configure `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `TEST_DATABASE_URL`, or `PLAYWRIGHT_BASE_URL` in Vercel. They are local-development or test settings.

## Database and data migrations

Apply every committed SQL migration before deploying code that depends on it:

```powershell
pnpm db:migrate
```

Safety rules:

- Point `DATABASE_URL` at the intended Neon demo database and verify the database name before running the command.
- Prefer additive, forward-only migrations. If a release fails after a migration, correct it with a new migration rather than dropping the database.
- Treat `pnpm db:seed` as a destructive demo reset: it replaces operational sample data with the curated fictional baseline.

## Validation

After the first deployment and after a release that changes authentication, data, or routing:

1. Open the public home page and verify its metadata and logo load correctly.
2. Open `/demo/access`, select **Open demo workspace**, and verify that the dashboard opens without requesting credentials.
3. Visit the patient directory and the weekly schedule; create a temporary record or appointment only if you intend to reset the demo afterward.
4. If you need to validate baseline restoration, run `pnpm db:seed` locally with the production demo environment configured, then refresh the deployed workspace and confirm that the curated fictional data returns.
5. Check the Vercel deployment logs for runtime errors and confirm the GitHub Actions workflow completed for the merged revision.

## Recovery

For an application-only regression, redeploy the last known good Vercel deployment. For a schema or data problem, roll forward with a corrected migration, then use `pnpm db:seed` only when a full restoration of the fictional demo baseline is appropriate. Do not recover by deleting the database or by loading real operational data.

## Deployment boundaries

- The public environment is a portfolio demo, not a clinical, billing, or production practice system.
- The configured Better Auth origin is the canonical production URL. Treat preview deployments as build previews unless they receive their own deliberately configured database and approved authentication origin.
- Vercel and Neon environment variables are the source of deployment secrets; `.env.example` remains fictional setup guidance only.

## Related documentation

- [Project overview](PROJECT.md) — product scope, workflows, and domain rules.
- [README](../README.md) — product evidence, local setup, and quality commands.
