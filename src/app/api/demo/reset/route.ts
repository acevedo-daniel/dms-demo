import { NextResponse } from "next/server";
import { resetDemoDatasetSchema } from "@/lib/contracts/demo";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { resetDemoDataset } from "@/lib/demo/reset";
import { DomainError } from "@/lib/domain/errors";
import { errorResponse, parseContract } from "@/lib/domain/http";

export async function POST(request: Request) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const body = await request.text();
    let input: unknown = {};

    if (body) {
      try {
        input = JSON.parse(body);
      } catch {
        throw new DomainError(
          "VALIDATION_ERROR",
          400,
          "The request body must be valid JSON.",
        );
      }
    }

    parseContract(resetDemoDatasetSchema, input);
    await resetDemoDataset();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
