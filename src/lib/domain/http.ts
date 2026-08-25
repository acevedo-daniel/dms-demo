import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError, ValidationError } from "@/lib/domain/errors";

export function parseContract<Output>(
  schema: {
    safeParse: (
      input: unknown,
    ) => { data: Output; success: true } | { error: ZodError; success: false };
  },
  input: unknown,
) {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  return parsed.data;
}

export function errorResponse(error: unknown) {
  if (error instanceof DomainError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          details: error.details,
          message: error.message,
        },
      },
      { status: error.status },
    );
  }

  console.error("Unhandled domain request error", error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "The request could not be completed.",
      },
    },
    { status: 500 },
  );
}
