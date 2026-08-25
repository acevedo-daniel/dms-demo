import { hashPassword } from "better-auth/crypto";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import {
  DEMO_ADMIN_NAME,
  DEMO_ADMIN_ROLE,
  DEMO_PRACTICE_ID,
  getDemoClock,
} from "@/lib/demo/constants";

type DemoDatabase = NodePgDatabase<typeof schema>;

const practiceId = DEMO_PRACTICE_ID;
const demoAdminId = "demo-admin";

type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

function appointment(
  idSuffix: string,
  patientSuffix: string,
  treatmentSuffix: string,
  startsAt: string,
  durationMinutes: number,
  status: AppointmentStatus,
  note?: string,
) {
  const timestamp = getDemoClock();

  return {
    id: `40000000-0000-4000-8000-000000000${idSuffix}`,
    practiceId,
    patientId: `30000000-0000-4000-8000-000000000${patientSuffix}`,
    treatmentId: `20000000-0000-4000-8000-000000000${treatmentSuffix}`,
    startsAt: new Date(startsAt),
    durationMinutes,
    status,
    ...(note ? { note } : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function patientNote(
  idSuffix: string,
  patientSuffix: string,
  body: string,
  createdAt: string,
  treatmentSuffix?: string,
) {
  const timestamp = new Date(createdAt);

  return {
    id: `50000000-0000-4000-8000-000000000${idSuffix}`,
    practiceId,
    patientId: `30000000-0000-4000-8000-000000000${patientSuffix}`,
    ...(treatmentSuffix
      ? {
          treatmentId: `20000000-0000-4000-8000-000000000${treatmentSuffix}`,
        }
      : {}),
    body,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function seedDemoWorkspace(db: DemoDatabase) {
  const demoClock = getDemoClock();

  await db.transaction(async (tx) => {
    await tx
      .insert(schema.practices)
      .values({
        id: practiceId,
        name: "Atelier Dental",
        timezone: "America/Argentina/Buenos_Aires",
        createdAt: demoClock,
        updatedAt: demoClock,
      })
      .onConflictDoUpdate({
        target: schema.practices.id,
        set: {
          name: "Atelier Dental",
          timezone: "America/Argentina/Buenos_Aires",
          updatedAt: demoClock,
        },
      });

    await tx
      .delete(schema.patientNotes)
      .where(eq(schema.patientNotes.practiceId, practiceId));
    await tx
      .delete(schema.appointments)
      .where(eq(schema.appointments.practiceId, practiceId));
    await tx
      .delete(schema.patients)
      .where(eq(schema.patients.practiceId, practiceId));
    await tx
      .delete(schema.treatments)
      .where(eq(schema.treatments.practiceId, practiceId));

    await tx.insert(schema.treatments).values([
      {
        id: "20000000-0000-4000-8000-000000000001",
        practiceId,
        name: "Routine consultation",
        category: "General dentistry",
        description: "A standard appointment for routine care coordination.",
        defaultDurationMinutes: 30,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        practiceId,
        name: "Hygiene visit",
        category: "Preventive care",
        description: "A scheduled preventive care visit.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000003",
        practiceId,
        name: "Restorative appointment",
        category: "Restorative care",
        description: "A scheduled restorative care appointment.",
        defaultDurationMinutes: 60,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000004",
        practiceId,
        name: "Urgent consultation",
        category: "General dentistry",
        description: "A reserved slot for a time-sensitive consultation.",
        defaultDurationMinutes: 30,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000005",
        practiceId,
        name: "Whitening consultation",
        category: "Cosmetic care",
        description:
          "An initial consultation to coordinate whitening services.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000006",
        practiceId,
        name: "Orthodontic review",
        category: "Orthodontics",
        description: "A scheduled review within an orthodontic care plan.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx.insert(schema.patients).values([
      {
        id: "30000000-0000-4000-8000-000000000001",
        practiceId,
        identifier: "AT-1001",
        firstName: "Alex",
        lastName: "Quinn",
        email: "patient-1001@example.com",
        phone: "+54 11 0000-1001",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000002",
        practiceId,
        identifier: "AT-1002",
        firstName: "Casey",
        lastName: "Morgan",
        email: "patient-1002@example.com",
        phone: "+54 11 0000-1002",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000003",
        practiceId,
        identifier: "AT-1003",
        firstName: "Jordan",
        lastName: "Ellis",
        email: "patient-1003@example.com",
        phone: "+54 11 0000-1003",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000004",
        practiceId,
        identifier: "AT-1004",
        firstName: "Taylor",
        lastName: "Reed",
        email: "patient-1004@example.com",
        phone: "+54 11 0000-1004",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000005",
        practiceId,
        identifier: "AT-1005",
        firstName: "Morgan",
        lastName: "Vale",
        email: "patient-1005@example.com",
        phone: "+54 11 0000-1005",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000006",
        practiceId,
        identifier: "AT-1006",
        firstName: "Riley",
        lastName: "Park",
        email: "patient-1006@example.com",
        phone: "+54 11 0000-1006",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000007",
        practiceId,
        identifier: "AT-1007",
        firstName: "Cameron",
        lastName: "Stone",
        email: "patient-1007@example.com",
        phone: "+54 11 0000-1007",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000008",
        practiceId,
        identifier: "AT-1008",
        firstName: "Avery",
        lastName: "Blake",
        email: "patient-1008@example.com",
        phone: "+54 11 0000-1008",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000009",
        practiceId,
        identifier: "AT-1009",
        firstName: "Quinn",
        lastName: "Harper",
        email: "patient-1009@example.com",
        phone: "+54 11 0000-1009",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000010",
        practiceId,
        identifier: "AT-1010",
        firstName: "Rowan",
        lastName: "Flynn",
        email: "patient-1010@example.com",
        phone: "+54 11 0000-1010",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000011",
        practiceId,
        identifier: "AT-1011",
        firstName: "Jules",
        lastName: "Marin",
        email: "patient-1011@example.com",
        phone: "+54 11 0000-1011",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000012",
        practiceId,
        identifier: "AT-1012",
        firstName: "Devon",
        lastName: "Lane",
        email: "patient-1012@example.com",
        phone: "+54 11 0000-1012",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx
      .insert(schema.appointments)
      .values([
        appointment(
          "001",
          "001",
          "001",
          "2026-05-07T12:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "002",
          "005",
          "002",
          "2026-05-07T13:00:00.000Z",
          45,
          "COMPLETED",
        ),
        appointment(
          "003",
          "002",
          "003",
          "2026-05-08T14:00:00.000Z",
          60,
          "CANCELLED",
          "Cancelled before the scheduled time.",
        ),
        appointment(
          "004",
          "008",
          "004",
          "2026-05-11T12:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "005",
          "006",
          "001",
          "2026-05-11T13:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "006",
          "007",
          "006",
          "2026-05-11T15:00:00.000Z",
          45,
          "CANCELLED",
          "Cancelled before the scheduled time.",
        ),
        appointment(
          "007",
          "001",
          "002",
          "2026-05-12T12:30:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "008",
          "003",
          "001",
          "2026-05-12T13:30:00.000Z",
          30,
          "CONFIRMED",
        ),
        appointment(
          "009",
          "005",
          "003",
          "2026-05-12T14:30:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "010",
          "007",
          "005",
          "2026-05-12T16:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "011",
          "009",
          "001",
          "2026-05-12T17:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "012",
          "010",
          "004",
          "2026-05-12T18:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "013",
          "011",
          "006",
          "2026-05-12T19:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "014",
          "004",
          "003",
          "2026-05-13T12:00:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "015",
          "002",
          "002",
          "2026-05-13T13:30:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "016",
          "006",
          "001",
          "2026-05-13T15:00:00.000Z",
          30,
          "CONFIRMED",
        ),
        appointment(
          "017",
          "008",
          "005",
          "2026-05-13T17:00:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "018",
          "012",
          "004",
          "2026-05-13T18:00:00.000Z",
          30,
          "CONFIRMED",
        ),
        appointment(
          "019",
          "010",
          "006",
          "2026-05-14T12:00:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "020",
          "003",
          "002",
          "2026-05-14T14:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "021",
          "007",
          "003",
          "2026-05-14T16:00:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "022",
          "009",
          "001",
          "2026-05-15T13:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "023",
          "001",
          "005",
          "2026-05-15T15:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "024",
          "005",
          "006",
          "2026-05-15T17:00:00.000Z",
          45,
          "SCHEDULED",
        ),
      ]);

    await tx
      .insert(schema.patientNotes)
      .values([
        patientNote(
          "001",
          "001",
          "Appointment preparation details reviewed.",
          "2026-05-11T15:00:00.000Z",
          "002",
        ),
        patientNote(
          "002",
          "003",
          "Prefers afternoon times when available.",
          "2026-05-12T11:00:00.000Z",
        ),
        patientNote(
          "003",
          "005",
          "Follow-up appointment coordinated.",
          "2026-05-07T14:00:00.000Z",
          "003",
        ),
        patientNote(
          "004",
          "006",
          "Requested a reminder at the next check-in.",
          "2026-05-06T15:00:00.000Z",
        ),
        patientNote(
          "005",
          "007",
          "Consultation slot confirmed.",
          "2026-05-12T13:00:00.000Z",
          "005",
        ),
        patientNote(
          "006",
          "008",
          "Availability updated for weekday mornings.",
          "2026-05-10T15:00:00.000Z",
        ),
        patientNote(
          "007",
          "009",
          "Next visit has been added to the schedule.",
          "2026-05-12T14:00:00.000Z",
          "001",
        ),
        patientNote(
          "008",
          "010",
          "Requested coordination before the next visit.",
          "2026-05-12T15:00:00.000Z",
          "004",
        ),
        patientNote(
          "009",
          "011",
          "Review appointment recorded.",
          "2026-05-08T14:00:00.000Z",
          "006",
        ),
        patientNote(
          "010",
          "012",
          "Schedule preference noted.",
          "2026-05-11T14:00:00.000Z",
        ),
      ]);
  });
}

export async function seedDemoIdentity(
  db: DemoDatabase,
  credentials: { email: string; password: string },
) {
  const demoClock = getDemoClock();

  await db.transaction(async (tx) => {
    await tx.delete(schema.authVerifications);
    await tx.delete(schema.authSessions);
    await tx.delete(schema.authAccounts);
    await tx.delete(schema.authUsers);
  });

  const password = await hashPassword(credentials.password);

  await db.insert(schema.authUsers).values({
    id: demoAdminId,
    practiceId,
    role: DEMO_ADMIN_ROLE,
    name: DEMO_ADMIN_NAME,
    email: credentials.email,
    emailVerified: true,
    createdAt: demoClock,
    updatedAt: demoClock,
  });

  await db.insert(schema.authAccounts).values({
    id: "demo-admin-credential",
    issuer: "local:credential",
    accountId: demoAdminId,
    providerId: "credential",
    userId: demoAdminId,
    password,
    createdAt: demoClock,
    updatedAt: demoClock,
  });
}
