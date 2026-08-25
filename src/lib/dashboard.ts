import "server-only";

import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import { appointments, patientNotes, patients, treatments } from "@/db/schema";
import { DEMO_PRACTICE_ID, getDemoClock } from "@/lib/demo/constants";

const practiceTimeZone = "America/Argentina/Buenos_Aires";
const activeAppointmentStatuses = ["SCHEDULED", "CONFIRMED"] as const;

export type DashboardAppointmentStatus =
  "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const appointmentSelection = {
  durationMinutes: appointments.durationMinutes,
  id: appointments.id,
  patientId: patients.id,
  patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
  startsAt: appointments.startsAt,
  status: appointments.status,
  treatmentName: treatments.name,
};

function getTimeZoneOffset(date: Date) {
  const timeZoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: practiceTimeZone,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = timeZoneName?.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);

  if (!match) {
    throw new Error("Unable to resolve the practice timezone offset.");
  }

  const [, sign, hours, minutes = "0"] = match;
  const offsetMinutes = Number(hours) * 60 + Number(minutes);

  return (sign === "+" ? 1 : -1) * offsetMinutes * 60_000;
}

function startOfDemoDay() {
  const clock = getDemoClock();
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: practiceTimeZone,
    year: "numeric",
  }).formatToParts(clock);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const localMidnight = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
  );

  return new Date(localMidnight - getTimeZoneOffset(clock));
}

export function formatDemoDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: practiceTimeZone,
    weekday: "long",
    year: "numeric",
  }).format(date);
}

export function formatDemoTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: practiceTimeZone,
  }).format(date);
}

export async function getDashboardData() {
  const db = getDatabase();
  const dayStart = startOfDemoDay();
  const nextDayStart = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const followingDayStart = new Date(
    nextDayStart.getTime() + 24 * 60 * 60 * 1000,
  );

  const [today, needsAttention, recentNotes] = await Promise.all([
    db
      .select(appointmentSelection)
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
      .where(
        and(
          eq(appointments.practiceId, DEMO_PRACTICE_ID),
          gte(appointments.startsAt, dayStart),
          lt(appointments.startsAt, nextDayStart),
          inArray(appointments.status, activeAppointmentStatuses),
        ),
      )
      .orderBy(asc(appointments.startsAt)),
    db
      .select(appointmentSelection)
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(treatments, eq(appointments.treatmentId, treatments.id))
      .where(
        and(
          eq(appointments.practiceId, DEMO_PRACTICE_ID),
          eq(appointments.status, "SCHEDULED"),
          gte(appointments.startsAt, dayStart),
          lt(appointments.startsAt, followingDayStart),
        ),
      )
      .orderBy(asc(appointments.startsAt))
      .limit(3),
    db
      .select({
        body: patientNotes.body,
        createdAt: patientNotes.createdAt,
        id: patientNotes.id,
        patientId: patients.id,
        patientName: sql<string>`${patients.firstName} || ' ' || ${patients.lastName}`,
        treatmentName: treatments.name,
      })
      .from(patientNotes)
      .innerJoin(patients, eq(patientNotes.patientId, patients.id))
      .leftJoin(treatments, eq(patientNotes.treatmentId, treatments.id))
      .where(eq(patientNotes.practiceId, DEMO_PRACTICE_ID))
      .orderBy(desc(patientNotes.createdAt))
      .limit(3),
  ]);

  return {
    needsAttention: needsAttention.map((appointment) => ({
      ...appointment,
      status: appointment.status as DashboardAppointmentStatus,
    })),
    recentNotes,
    today: today.map((appointment) => ({
      ...appointment,
      status: appointment.status as DashboardAppointmentStatus,
    })),
  };
}
