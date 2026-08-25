import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { updatePatientNote } from "@/lib/domain/notes";
import { DomainError } from "@/lib/domain/errors";
import { errorResponse } from "@/lib/domain/http";

type RouteParameters = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParameters) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const { id } = await params;
    let input: unknown;

    try {
      input = await request.json();
    } catch {
      throw new DomainError(
        "VALIDATION_ERROR",
        400,
        "The request body must be valid JSON.",
      );
    }

    return NextResponse.json({ note: await updatePatientNote(id, input) });
  } catch (error) {
    return errorResponse(error);
  }
}
