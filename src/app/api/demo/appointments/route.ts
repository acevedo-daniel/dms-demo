import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { createAppointment } from "@/lib/domain/appointments";
import { DomainError } from "@/lib/domain/errors";
import { errorResponse } from "@/lib/domain/http";

export async function POST(request: Request) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
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

    return NextResponse.json(
      { appointment: await createAppointment(input) },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
