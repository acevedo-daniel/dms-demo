import { NextResponse } from "next/server";
import { authorizeDemoMutation } from "@/lib/auth/mutation";
import { updatePatient } from "@/lib/domain/patient-records";
import { errorResponse } from "@/lib/domain/http";

type RouteParameters = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParameters) {
  const authorization = await authorizeDemoMutation(request.headers);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const { id } = await params;
    return NextResponse.json(await updatePatient(id, await request.json()));
  } catch (error) {
    return errorResponse(error);
  }
}
