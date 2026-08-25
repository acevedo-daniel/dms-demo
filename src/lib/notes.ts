import "server-only";

import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { patientNotes, patients, treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID } from "@/lib/demo/constants";

export type NoteComposerPatient = {
  id: string;
  identifier: string;
  name: string;
};

export type NoteComposerTreatment = {
  id: string;
  name: string;
};

export type PatientNoteItem = {
  body: string;
  createdAt: string;
  id: string;
  patientId: string;
  patientName: string;
  treatmentId: string | null;
  treatmentName: string | null;
};

export async function getNoteComposerOptions() {
  const db = getDatabase();
  const [notePatients, noteTreatments] = await Promise.all([
    db
      .select({
        id: patients.id,
        identifier: patients.identifier,
        name: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
      })
      .from(patients)
      .where(
        and(
          eq(patients.practiceId, DEMO_PRACTICE_ID),
          isNull(patients.archivedAt),
        ),
      )
      .orderBy(asc(patients.lastName), asc(patients.firstName)),
    db
      .select({ id: treatments.id, name: treatments.name })
      .from(treatments)
      .where(eq(treatments.practiceId, DEMO_PRACTICE_ID))
      .orderBy(asc(treatments.name)),
  ]);

  return { patients: notePatients, treatments: noteTreatments };
}

export async function getPatientNotes(): Promise<PatientNoteItem[]> {
  const notes = await getDatabase()
    .select({
      body: patientNotes.body,
      createdAt: patientNotes.createdAt,
      id: patientNotes.id,
      patientId: patients.id,
      patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
      treatmentId: treatments.id,
      treatmentName: treatments.name,
    })
    .from(patientNotes)
    .innerJoin(patients, eq(patientNotes.patientId, patients.id))
    .leftJoin(treatments, eq(patientNotes.treatmentId, treatments.id))
    .where(eq(patientNotes.practiceId, DEMO_PRACTICE_ID))
    .orderBy(desc(patientNotes.createdAt));

  return notes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
  }));
}
