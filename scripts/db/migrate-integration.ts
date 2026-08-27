import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { requireTestDatabaseUrl } from "../../src/lib/testing/test-database";

const pool = new Pool({ connectionString: requireTestDatabaseUrl() });
const db = drizzle({ client: pool });

async function migrateIntegrationDatabase() {
  await migrate(db, { migrationsFolder: "drizzle" });
  console.info("Migrated the DMS integration database.");
}

migrateIntegrationDatabase().finally(async () => {
  await pool.end();
});
