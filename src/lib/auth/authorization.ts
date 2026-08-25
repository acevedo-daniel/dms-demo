import "server-only";

import { getAuth } from "@/lib/auth";
import { DEMO_ADMIN_ROLE, DEMO_PRACTICE_ID } from "@/lib/demo/constants";

export type DemoAuthorization =
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | {
      status: "authorized";
      session: NonNullable<
        Awaited<ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>>
      >;
    };

export async function authorizeDemoRequest(
  headers: Headers,
): Promise<DemoAuthorization> {
  const session = await getAuth().api.getSession({ headers });

  if (!session) {
    return { status: "unauthenticated" };
  }

  if (
    session.user.role !== DEMO_ADMIN_ROLE ||
    session.user.practiceId !== DEMO_PRACTICE_ID
  ) {
    return { status: "forbidden" };
  }

  return { status: "authorized", session };
}
