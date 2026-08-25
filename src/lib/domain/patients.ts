import "server-only";

import { and, eq, gt, inArray } from "drizzle-orm";
import { archivePatientSchema } from "@/lib/contracts/patient";
import { getDatabase } from "@/db/client";
import { appointments, patients } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";
import { ConflictError, NotFoundError } from "@/lib/domain/errors";
import { parseContract } from "@/lib/domain/http";
import { activeAppointmentStatuses } from "@/lib/domain/schedule";

export async function archivePatient(patientId: string, input: unknown = {}) {
  parseContract(archivePatientSchema, input);

  const db = getDatabase();
  const [patient] = await db
    .select({ archivedAt: patients.archivedAt, id: patients.id })
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

  if (patient.archivedAt) {
    return patient;
  }

  const [activeAppointment] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        eq(appointments.practiceId, DEMO_PRACTICE_ID),
        gt(appointments.startsAt, getDemoClock()),
        inArray(appointments.status, activeAppointmentStatuses),
      ),
    )
    .limit(1);

  if (activeAppointment) {
    throw new ConflictError(
      "Cancel or complete active appointments before archiving this patient.",
      { appointmentId: activeAppointment.id },
    );
  }

  const archivedAt = getDemoClock();
  const [archivedPatient] = await db
    .update(patients)
    .set({ archivedAt, updatedAt: archivedAt })
    .where(eq(patients.id, patientId))
    .returning();

  return archivedPatient;
}
