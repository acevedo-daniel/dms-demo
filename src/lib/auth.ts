import "server-only";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { getDatabase } from "@/db/client";
import * as schema from "@/db/schema";
import { requireServerEnvironment } from "@/lib/demo/environment";

let authInstance: ReturnType<typeof createAuth> | undefined;

function createAuth() {
  const baseURL = requireServerEnvironment("BETTER_AUTH_URL");

  return betterAuth({
    baseURL,
    secret: requireServerEnvironment("BETTER_AUTH_SECRET"),
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      schema: {
        ...schema,
        user: schema.authUsers,
        session: schema.authSessions,
        account: schema.authAccounts,
        verification: schema.authVerifications,
      },
    }),
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          input: false,
          returned: true,
        },
        practiceId: {
          type: "string",
          required: true,
          input: false,
          returned: true,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60,
    },
  });
}

export function getAuth() {
  authInstance ??= createAuth();
  return authInstance;
}
