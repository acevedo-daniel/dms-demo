import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../src/db/schema";
import { seedDemoIdentity, seedDemoWorkspace } from "../../src/db/demo-seed";
import {
  getTestDemoCredentials,
  requireTestDatabaseUrl,
} from "../../src/lib/testing/test-database";

const pool = new Pool({ connectionString: requireTestDatabaseUrl() });
const db = drizzle({ client: pool, schema });

async function seedIntegrationDatabase() {
  await seedDemoWorkspace(db);
  await seedDemoIdentity(db, getTestDemoCredentials());
  console.info("Seeded the DMS end-to-end test database.");
}

seedIntegrationDatabase().finally(async () => {
  await pool.end();
});
