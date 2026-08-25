import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { archivePatient } from "@/lib/domain/patients";
import { errorResponse } from "@/lib/domain/http";

type RouteParameters = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParameters) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const { id } = await params;
    const body = await request.text();
    return NextResponse.json(
      await archivePatient(id, body ? JSON.parse(body) : {}),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
