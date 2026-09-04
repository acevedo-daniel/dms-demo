import "server-only";

import { and, asc, desc, eq, gte, inArray, isNull, lt } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { appointments, patientNotes, patients, treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";
import { NotFoundError } from "@/lib/domain/errors";
import { activeAppointmentStatuses } from "@/lib/domain/schedule";

export type PatientDirectoryItem = {
  email: string | null;
  firstName: string;
  id: string;
  identifier: string;
  lastName: string;
  nextAppointment: {
    startsAt: string;
    treatmentName: string;
  } | null;
  phone: string | null;
};

export type PatientRecord = {
  archivedAt: string | null;
  clinicalAlert: string;
  completedVisitCount: number;
  email: string | null;
  firstName: string;
  id: string;
  identifier: string;
  lastName: string;
  nextAppointment: {
    id: string;
    startsAt: string;
    status: "SCHEDULED" | "CONFIRMED";
    treatmentId: string;
    treatmentName: string;
  } | null;
  phone: string | null;
  relevantTreatment: {
    category: string;
    defaultDurationMinutes: number;
    description: string;
    id: string;
    name: string;
  } | null;
  schedulingPreference: string;
  timeline: Array<
    | {
        id: string;
        kind: "appointment";
        startsAt: string;
        status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
        treatmentId: string;
        treatmentName: string;
      }
    | {
        body: string;
        id: string;
        kind: "note";
        treatmentId: string | null;
        treatmentName: string | null;
        createdAt: string;
      }
  >;
};

const appointmentProjection = {
  id: appointments.id,
  startsAt: appointments.startsAt,
  status: appointments.status,
  treatmentCategory: treatments.category,
  treatmentDescription: treatments.description,
  treatmentDuration: treatments.defaultDurationMinutes,
  treatmentId: treatments.id,
  treatmentName: treatments.name,
};

function toDirectoryPatient(
  patient: typeof patients.$inferSelect,
): PatientDirectoryItem {
  return {
    email: patient.email,
    firstName: patient.firstName,
    id: patient.id,
    identifier: patient.identifier,
    lastName: patient.lastName,
    nextAppointment: null,
    phone: patient.phone,
  };
}

export async function getPatientDirectory(): Promise<PatientDirectoryItem[]> {
  const db = getDatabase();
  const [directory, nextAppointments] = await Promise.all([
    db
      .select()
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
        patientId: appointments.patientId,
        startsAt: appointments.startsAt,
        treatmentName: treatments.name,
      })
      .from(appointments)
      .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
      .where(
        and(
          eq(appointments.practiceId, DEMO_PRACTICE_ID),
          gte(appointments.startsAt, getDemoClock()),
          inArray(appointments.status, activeAppointmentStatuses),
        ),
      )
      .orderBy(asc(appointments.startsAt)),
  ]);
  const nextByPatient = new Map<string, (typeof nextAppointments)[number]>();

  for (const appointment of nextAppointments) {
    if (!nextByPatient.has(appointment.patientId)) {
      nextByPatient.set(appointment.patientId, appointment);
    }
  }

  return directory.map((patient) => {
    const nextAppointment = nextByPatient.get(patient.id);

    return {
      ...toDirectoryPatient(patient),
      nextAppointment: nextAppointment
        ? {
            startsAt: nextAppointment.startsAt.toISOString(),
            treatmentName: nextAppointment.treatmentName,
          }
        : null,
    };
  });
}

export async function getPatientRecord(
  patientId: string,
): Promise<PatientRecord> {
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

  const futureConditions = and(
    eq(appointments.patientId, patientId),
    eq(appointments.practiceId, DEMO_PRACTICE_ID),
    gte(appointments.startsAt, getDemoClock()),
    inArray(appointments.status, activeAppointmentStatuses),
  );
  const [futureAppointments, historicalAppointments, notes] = await Promise.all(
    [
      db
        .select(appointmentProjection)
        .from(appointments)
        .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
        .where(futureConditions)
        .orderBy(asc(appointments.startsAt)),
      db
        .select(appointmentProjection)
        .from(appointments)
        .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
        .where(
          and(
            eq(appointments.patientId, patientId),
            eq(appointments.practiceId, DEMO_PRACTICE_ID),
            lt(appointments.startsAt, getDemoClock()),
          ),
        )
        .orderBy(desc(appointments.startsAt)),
      db
        .select({
          body: patientNotes.body,
          createdAt: patientNotes.createdAt,
          id: patientNotes.id,
          treatmentId: patientNotes.treatmentId,
          treatmentName: treatments.name,
        })
        .from(patientNotes)
        .leftJoin(treatments, eq(patientNotes.treatmentId, treatments.id))
        .where(
          and(
            eq(patientNotes.patientId, patientId),
            eq(patientNotes.practiceId, DEMO_PRACTICE_ID),
          ),
        )
        .orderBy(desc(patientNotes.createdAt)),
    ],
  );
  const nextAppointment = futureAppointments[0] ?? null;
  const completedAppointment = historicalAppointments.find(
    (appointment) => appointment.status === "COMPLETED",
  );
  const relevantTreatment = nextAppointment ?? completedAppointment ?? null;
  const completedVisitCount = historicalAppointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;
  const timingReference = nextAppointment ?? completedAppointment ?? null;
  const schedulingPreference = timingReference
    ? timingReference.startsAt.getUTCHours() < 15
      ? "Prefers morning"
      : "Prefers afternoon"
    : "No timing preference recorded";
  const historicalTimeline = [
    ...historicalAppointments.map((appointment) => ({
      id: appointment.id,
      kind: "appointment" as const,
      startsAt: appointment.startsAt,
      status: appointment.status as
        "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
      treatmentId: appointment.treatmentId,
      treatmentName: appointment.treatmentName,
    })),
    ...notes.map((note) => ({
      body: note.body,
      createdAt: note.createdAt,
      id: note.id,
      kind: "note" as const,
      treatmentId: note.treatmentId,
      treatmentName: note.treatmentName,
    })),
  ].sort((left, right) => {
    const leftTime = "startsAt" in left ? left.startsAt : left.createdAt;
    const rightTime = "startsAt" in right ? right.startsAt : right.createdAt;
    return rightTime.getTime() - leftTime.getTime();
  });

  return {
    archivedAt: patient.archivedAt?.toISOString() ?? null,
    clinicalAlert: "No clinical alert recorded",
    completedVisitCount,
    email: patient.email,
    firstName: patient.firstName,
    id: patient.id,
    identifier: patient.identifier,
    lastName: patient.lastName,
    nextAppointment: nextAppointment
      ? {
          id: nextAppointment.id,
          startsAt: nextAppointment.startsAt.toISOString(),
          status: nextAppointment.status as "SCHEDULED" | "CONFIRMED",
          treatmentId: nextAppointment.treatmentId,
          treatmentName: nextAppointment.treatmentName,
        }
      : null,
    phone: patient.phone,
    relevantTreatment: relevantTreatment
      ? {
          category: relevantTreatment.treatmentCategory,
          defaultDurationMinutes: relevantTreatment.treatmentDuration,
          description: relevantTreatment.treatmentDescription,
          id: relevantTreatment.treatmentId,
          name: relevantTreatment.treatmentName,
        }
      : null,
    schedulingPreference,
    timeline: historicalTimeline.map((item) => {
      if (item.kind === "appointment") {
        return { ...item, startsAt: item.startsAt.toISOString() };
      }

      return { ...item, createdAt: item.createdAt.toISOString() };
    }),
  };
}
