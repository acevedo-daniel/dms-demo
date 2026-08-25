import "server-only";

import { authorizeDemoRequest } from "@/lib/auth/authorization";
import { AuthenticationError, AuthorizationError } from "@/lib/domain/errors";
import { errorResponse } from "@/lib/domain/http";

export async function authorizeDemoMutation(headers: Headers) {
  const authorization = await authorizeDemoRequest(headers);

  if (authorization.status === "authorized") {
    return authorization;
  }

  return errorResponse(
    authorization.status === "unauthenticated"
      ? new AuthenticationError()
      : new AuthorizationError(),
  );
}
