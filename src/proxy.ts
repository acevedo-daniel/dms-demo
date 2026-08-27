import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function applyDemoHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

function redirect(request: NextRequest, pathname: string) {
  return applyDemoHeaders(
    NextResponse.redirect(new URL(pathname, request.url)),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login"
  ) {
    return redirect(request, "/demo/access");
  }

  return applyDemoHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/demo/:path*", "/admin/:path*", "/login"],
};
