const expectedDatabaseName = "dms_test";
const localTestDatabaseUrl =
  "postgresql://dms_test:dms_test@localhost:5434/dms_test";

export const defaultTestDemoCredentials = {
  email: "demo-admin@dms.invalid",
  password: "dms-e2e-test-password",
};

export function requireTestDatabaseUrl() {
  const value = process.env.TEST_DATABASE_URL ?? localTestDatabaseUrl;

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

export function getTestDemoCredentials() {
  return {
    email: process.env.DEMO_AUTH_EMAIL ?? defaultTestDemoCredentials.email,
    password:
      process.env.DEMO_AUTH_PASSWORD ?? defaultTestDemoCredentials.password,
  };
}
