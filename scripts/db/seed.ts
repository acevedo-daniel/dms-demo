import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../src/db/schema";
import { seedDemoIdentity, seedDemoWorkspace } from "../../src/db/demo-seed";

function requireEnvironment(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for database commands.`);
  }

  return value;
}

const pool = new Pool({
  connectionString: requireEnvironment("DATABASE_URL"),
});
const db = drizzle({ client: pool, schema });

async function seed() {
  await seedDemoWorkspace(db);
  await seedDemoIdentity(db, {
    email: requireEnvironment("DEMO_AUTH_EMAIL"),
    password: requireEnvironment("DEMO_AUTH_PASSWORD"),
  });
}

seed()
  .then(() => {
    console.info("Seeded the DMS demo workspace.");
  })
  .finally(async () => {
    await pool.end();
  });
