import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getDemoCredentials } from "@/lib/demo/environment";

function copySessionCookies(source: Response, target: NextResponse) {
  const cookies = source.headers.get("set-cookie");

  if (cookies) {
    target.headers.set("set-cookie", cookies);
  }
}

export async function POST() {
  const { email, password } = getDemoCredentials();
  const signInResponse = await getAuth().api.signInEmail({
    body: { email, password, rememberMe: false },
    asResponse: true,
  });

  if (!signInResponse.ok) {
    return NextResponse.json(
      { error: "Demo access is temporarily unavailable." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  copySessionCookies(signInResponse, response);

  return response;
}
