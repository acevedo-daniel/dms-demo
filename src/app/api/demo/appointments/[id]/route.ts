import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { updateAppointment } from "@/lib/domain/appointments";
import { DomainError } from "@/lib/domain/errors";
import { errorResponse } from "@/lib/domain/http";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const { id } = await context.params;
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

    const appointment = await updateAppointment(id, input);

    return NextResponse.json({ appointment });
  } catch (error) {
    return errorResponse(error);
  }
}
