const expectedDatabaseName = "dms_test";

export function requireTestDatabaseUrl() {
  const value = process.env.TEST_DATABASE_URL;

  if (!value) {
    throw new Error(
      "TEST_DATABASE_URL is required to run PostgreSQL integration tests.",
    );
  }

  let databaseUrl: URL;

  try {
    databaseUrl = new URL(value);
  } catch {
    throw new Error(
      "TEST_DATABASE_URL must be a valid PostgreSQL connection URL.",
    );
  }

  const databaseName = databaseUrl.pathname.replace(/^\//, "");

  if (databaseName !== expectedDatabaseName) {
    throw new Error(
      `Integration tests only run against the ${expectedDatabaseName} database.`,
    );
  }

  return value;
}
