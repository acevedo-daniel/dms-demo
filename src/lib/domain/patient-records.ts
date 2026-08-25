import "server-only";

import { and, eq } from "drizzle-orm";
import {
  createPatientSchema,
  updatePatientSchema,
} from "@/lib/contracts/patient";
import { getDatabase } from "@/db/client";
import { patients } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";
import { ConflictError, NotFoundError } from "@/lib/domain/errors";
import { parseContract } from "@/lib/domain/http";

async function getPatient(patientId: string) {
  const db = getDatabase();
  const [patient] = await db
    .select()
    .from(patients)
    .where(
      and(
        eq(patients.id, patientId),
        eq(patients.practiceId, DEMO_PRACTICE_ID),
      ),
    )
    .limit(1);

  if (!patient) {
    throw new NotFoundError("Patient");
  }

  return patient;
}

async function assertIdentifierAvailable(
  identifier: string,
  patientId?: string,
) {
  const db = getDatabase();
  const [existing] = await db
    .select({ id: patients.id })
    .from(patients)
    .where(
      and(
        eq(patients.practiceId, DEMO_PRACTICE_ID),
        eq(patients.identifier, identifier),
      ),
    )
    .limit(1);

  if (existing && existing.id !== patientId) {
    throw new ConflictError(
      "This identifier is already used in this workspace.",
    );
  }
}

function translateIdentifierConflict(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    throw new ConflictError(
      "This identifier is already used in this workspace.",
    );
  }

  throw error;
}

export async function createPatient(input: unknown) {
  const values = parseContract(createPatientSchema, input);
  await assertIdentifierAvailable(values.identifier);

  try {
    const [patient] = await getDatabase()
      .insert(patients)
      .values({
        ...values,
        id: crypto.randomUUID(),
        practiceId: DEMO_PRACTICE_ID,
        createdAt: getDemoClock(),
        updatedAt: getDemoClock(),
      })
      .returning();

    return patient;
  } catch (error) {
    return translateIdentifierConflict(error);
  }
}

export async function updatePatient(patientId: string, input: unknown) {
  const values = parseContract(updatePatientSchema, input);
  const patient = await getPatient(patientId);

  if (patient.archivedAt) {
    throw new ConflictError("Archived patients cannot be edited.");
  }

  await assertIdentifierAvailable(values.identifier, patientId);

  try {
    const [updatedPatient] = await getDatabase()
      .update(patients)
      .set({ ...values, updatedAt: getDemoClock() })
      .where(eq(patients.id, patientId))
      .returning();

    return updatedPatient;
  } catch (error) {
    return translateIdentifierConflict(error);
  }
}
