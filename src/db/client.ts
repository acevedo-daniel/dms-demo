import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { requireServerEnvironment } from "@/lib/demo/environment";

type Database = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var dmsDatabase: Database | undefined;
}

export function getDatabase() {
  if (!globalThis.dmsDatabase) {
    const pool = new Pool({
      connectionString: requireServerEnvironment("DATABASE_URL"),
    });

    globalThis.dmsDatabase = drizzle({ client: pool, schema });
  }

  return globalThis.dmsDatabase;
}
