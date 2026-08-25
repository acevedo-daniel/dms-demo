import "server-only";

import { and, eq, inArray, lt, ne, sql } from "drizzle-orm";
import {
  createAppointmentSchema,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
  updateAppointmentSchema,
} from "@/lib/contracts/appointment";
import { getDatabase } from "@/db/client";
import { appointments, patients, treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";
import { parseContract } from "@/lib/domain/http";
import { ConflictError, NotFoundError } from "@/lib/domain/errors";
import {
  activeAppointmentStatuses,
  appointmentEnd,
  assertAppointmentTransition,
  assertScheduleSlot,
} from "@/lib/domain/schedule";

async function assertPatientIsAvailable(patientId: string) {
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
    throw new ConflictError(
      "Archived patients cannot receive new appointments.",
    );
  }
}

async function assertTreatmentExists(treatmentId: string) {
  const db = getDatabase();
  const [treatment] = await db
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

async function assertNoScheduleConflict(
  startsAt: Date,
  durationMinutes: number,
  appointmentId?: string,
) {
  const db = getDatabase();
  const end = appointmentEnd(startsAt, durationMinutes);
  const conditions = [
    eq(appointments.practiceId, DEMO_PRACTICE_ID),
    inArray(appointments.status, activeAppointmentStatuses),
    lt(appointments.startsAt, end),
    sql`${appointments.startsAt} + (${appointments.durationMinutes} * interval '1 minute') > ${startsAt}`,
  ];

  if (appointmentId) {
    conditions.push(ne(appointments.id, appointmentId));
  }

  const [conflict] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(...conditions))
    .limit(1);

  if (conflict) {
    throw new ConflictError("This time overlaps an active appointment.", {
      appointmentId: conflict.id,
    });
  }
}

async function getAppointment(appointmentId: string) {
  const db = getDatabase();
  const [appointment] = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.practiceId, DEMO_PRACTICE_ID),
      ),
    )
    .limit(1);

  if (!appointment) {
    throw new NotFoundError("Appointment");
  }

  return appointment;
}

function translateAppointmentConflict(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23P01"
  ) {
    throw new ConflictError("This time overlaps an active appointment.");
  }

  throw error;
}

export async function createAppointment(input: unknown) {
  const values = parseContract(createAppointmentSchema, input);

  assertScheduleSlot(values.startsAt, values.durationMinutes);
  await Promise.all([
    assertPatientIsAvailable(values.patientId),
    assertTreatmentExists(values.treatmentId),
  ]);
  await assertNoScheduleConflict(values.startsAt, values.durationMinutes);

  const db = getDatabase();
  try {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...values,
        id: crypto.randomUUID(),
        practiceId: DEMO_PRACTICE_ID,
        status: "SCHEDULED",
        createdAt: getDemoClock(),
        updatedAt: getDemoClock(),
      })
      .returning();

    return appointment;
  } catch (error) {
    return translateAppointmentConflict(error);
  }
}

export async function updateAppointment(appointmentId: string, input: unknown) {
  const updates = parseContract(updateAppointmentSchema, input);
  const current = await getAppointment(appointmentId);

  if (current.status === "COMPLETED" || current.status === "CANCELLED") {
    throw new ConflictError("Completed and cancelled appointments are final.");
  }

  if (updates.status) {
    assertAppointmentTransition(current.status, updates.status);
  }

  const next: CreateAppointmentInput & { status: string } = {
    durationMinutes: updates.durationMinutes ?? current.durationMinutes,
    note: updates.note ?? current.note ?? undefined,
    patientId: updates.patientId ?? current.patientId,
    startsAt: updates.startsAt ?? current.startsAt,
    status: updates.status ?? current.status,
    treatmentId: updates.treatmentId ?? current.treatmentId,
  };

  if (
    activeAppointmentStatuses.includes(next.status as "SCHEDULED" | "CONFIRMED")
  ) {
    assertScheduleSlot(next.startsAt, next.durationMinutes);
    await assertNoScheduleConflict(
      next.startsAt,
      next.durationMinutes,
      appointmentId,
    );
  }

  await Promise.all([
    assertPatientIsAvailable(next.patientId),
    assertTreatmentExists(next.treatmentId),
  ]);

  const db = getDatabase();
  try {
    const [appointment] = await db
      .update(appointments)
      .set({
        ...updates,
        updatedAt: getDemoClock(),
      })
      .where(eq(appointments.id, appointmentId))
      .returning();

    return appointment;
  } catch (error) {
    return translateAppointmentConflict(error);
  }
}

export async function cancelAppointment(appointmentId: string) {
  return updateAppointment(appointmentId, { status: "CANCELLED" });
}
