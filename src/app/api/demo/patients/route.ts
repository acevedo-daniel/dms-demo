import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { createPatient } from "@/lib/domain/patient-records";
import { errorResponse } from "@/lib/domain/http";

export async function POST(request: Request) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    return NextResponse.json(await createPatient(await request.json()), {
      status: 201,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
