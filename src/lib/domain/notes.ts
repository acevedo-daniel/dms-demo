import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import {
  createPatientNoteSchema,
  updatePatientNoteSchema,
} from "@/lib/contracts/note";
import { getDatabase } from "@/db/client";
import { patientNotes, patients, treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";
import { NotFoundError } from "@/lib/domain/errors";
import { parseContract } from "@/lib/domain/http";

async function assertPatientExists(patientId: string) {
  const [patient] = await getDatabase()
    .select({ id: patients.id })
    .from(patients)
    .where(
      and(
        eq(patients.id, patientId),
        eq(patients.practiceId, DEMO_PRACTICE_ID),
        isNull(patients.archivedAt),
      ),
    )
    .limit(1);

  if (!patient) {
    throw new NotFoundError("Patient");
  }
}

async function assertTreatmentExists(treatmentId?: string) {
  if (!treatmentId) {
    return;
  }

  const [treatment] = await getDatabase()
    .select({ id: treatments.id })
    .from(treatments)
    .where(
      and(
        eq(treatments.id, treatmentId),
        eq(treatments.practiceId, DEMO_PRACTICE_ID),
      ),
    )
    .limit(1);

  if (!treatment) {
    throw new NotFoundError("Treatment");
  }
}

async function getPatientNote(noteId: string) {
  const [note] = await getDatabase()
    .select()
    .from(patientNotes)
    .where(
      and(
        eq(patientNotes.id, noteId),
        eq(patientNotes.practiceId, DEMO_PRACTICE_ID),
      ),
    )
    .limit(1);

  if (!note) {
    throw new NotFoundError("Patient note");
  }

  return note;
}

export async function createPatientNote(input: unknown) {
  const values = parseContract(createPatientNoteSchema, input);
  await Promise.all([
    assertPatientExists(values.patientId),
    assertTreatmentExists(values.treatmentId),
  ]);

  const timestamp = getDemoClock();
  const [note] = await getDatabase()
    .insert(patientNotes)
    .values({
      ...values,
      id: crypto.randomUUID(),
      practiceId: DEMO_PRACTICE_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning();

  return note;
}

export async function updatePatientNote(noteId: string, input: unknown) {
  const values = parseContract(updatePatientNoteSchema, input);
  await getPatientNote(noteId);
  await Promise.all([
    assertPatientExists(values.patientId),
    assertTreatmentExists(values.treatmentId),
  ]);

  const [note] = await getDatabase()
    .update(patientNotes)
    .set({ ...values, updatedAt: getDemoClock() })
    .where(eq(patientNotes.id, noteId))
    .returning();

  return note;
}
