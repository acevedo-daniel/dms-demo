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
  try {
    const { email, password } = getDemoCredentials();
    const signInResponse = await getAuth().api.signInEmail({
      body: { email, password, rememberMe: false },
      asResponse: true,
    });

    if (!signInResponse.ok) {
      return NextResponse.json(
        { error: "The demo workspace could not be opened. Try again." },
        { status: 503 },
      );
    }

    const response = NextResponse.json({ ok: true });
    copySessionCookies(signInResponse, response);

    return response;
  } catch (error) {
    console.error("Demo access request failed", error);

    return NextResponse.json(
      { error: "The demo workspace could not be opened. Try again." },
      { status: 503 },
    );
  }
}
