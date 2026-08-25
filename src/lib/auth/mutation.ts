import "server-only";

import { NextResponse } from "next/server";
import { authorizeDemoRequest } from "@/lib/auth/authorization";

export async function authorizeDemoMutation(headers: Headers) {
  const authorization = await authorizeDemoRequest(headers);

  if (authorization.status === "authorized") {
    return authorization;
  }

  return NextResponse.json(
    { error: "A demo_admin session is required for this action." },
    { status: authorization.status === "unauthenticated" ? 401 : 403 },
  );
}
