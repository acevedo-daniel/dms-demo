import "server-only";

import { and, asc, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { appointments, patients, treatments } from "@/db/schema";
import { addPracticeDays } from "@/lib/demo/schedule";
import { DEMO_PRACTICE_ID } from "@/lib/demo/constants";
import { activeAppointmentStatuses } from "@/lib/domain/schedule";

export type ScheduleAppointment = {
  durationMinutes: number;
  id: string;
  note: string | null;
  patientId: string;
  patientName: string;
  startsAt: string;
  status: "SCHEDULED" | "CONFIRMED";
  treatmentId: string;
  treatmentName: string;
};

export type SchedulePatient = {
  id: string;
  identifier: string;
  name: string;
};

export type ScheduleTreatment = {
  defaultDurationMinutes: number;
  id: string;
  name: string;
};

export async function getScheduleData(weekStart: Date) {
  const db = getDatabase();
  const weekEnd = addPracticeDays(weekStart, 5);
  const [scheduleAppointments, schedulePatients, scheduleTreatments] =
    await Promise.all([
      db
        .select({
          durationMinutes: appointments.durationMinutes,
          id: appointments.id,
          note: appointments.note,
          patientId: patients.id,
          patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
          startsAt: appointments.startsAt,
          status: appointments.status,
          treatmentId: treatments.id,
          treatmentName: treatments.name,
        })
        .from(appointments)
        .innerJoin(patients, eq(appointments.patientId, patients.id))
        .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
        .where(
          and(
            eq(appointments.practiceId, DEMO_PRACTICE_ID),
            gte(appointments.startsAt, weekStart),
            lt(appointments.startsAt, weekEnd),
            inArray(appointments.status, activeAppointmentStatuses),
          ),
        )
        .orderBy(asc(appointments.startsAt)),
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
        .select({
          defaultDurationMinutes: treatments.defaultDurationMinutes,
          id: treatments.id,
          name: treatments.name,
        })
        .from(treatments)
        .where(eq(treatments.practiceId, DEMO_PRACTICE_ID))
        .orderBy(asc(treatments.name)),
    ]);

  return {
    appointments: scheduleAppointments.map((appointment) => ({
      ...appointment,
      startsAt: appointment.startsAt.toISOString(),
      status: appointment.status as "SCHEDULED" | "CONFIRMED",
    })),
    patients: schedulePatients,
    treatments: scheduleTreatments,
  };
}
