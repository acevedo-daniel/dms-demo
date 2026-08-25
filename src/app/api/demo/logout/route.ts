import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

function copySessionCookies(source: Response, target: NextResponse) {
  const cookies = source.headers.get("set-cookie");

  if (cookies) {
    target.headers.set("set-cookie", cookies);
  }
}

export async function POST(request: Request) {
  const signOutResponse = await getAuth().api.signOut({
    headers: request.headers,
    asResponse: true,
  });
  const response = NextResponse.json({ ok: true });
  copySessionCookies(signOutResponse, response);

  return response;
}
