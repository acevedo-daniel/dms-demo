import "dotenv/config";

import { defineConfig } from "@playwright/test";
import {
  getTestDemoCredentials,
  requireTestDatabaseUrl,
} from "./src/lib/testing/test-database";

const baseURL =
  process.env.CI && process.env.PLAYWRIGHT_BASE_URL
    ? process.env.PLAYWRIGHT_BASE_URL
    : "http://localhost:3100";
const credentials = getTestDemoCredentials();
const testEnvironment = {
  ...process.env,
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ??
    "dms-e2e-test-secret-with-at-least-32-characters",
  BETTER_AUTH_URL: baseURL,
  DATABASE_URL: requireTestDatabaseUrl(),
  DEMO_AUTH_EMAIL: credentials.email,
  DEMO_AUTH_PASSWORD: credentials.password,
  NEXT_PUBLIC_APP_URL: baseURL,
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm exec next dev --port 3100",
    env: { ...testEnvironment, NODE_ENV: "development" },
    reuseExistingServer: false,
    timeout: 120_000,
    url: `${baseURL}/demo/access`,
  },
  workers: 1,
});
