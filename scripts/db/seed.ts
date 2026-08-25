import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  appointments,
  patientNotes,
  patients,
  practices,
  treatments,
} from "../../src/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for database commands.");
}

const demoClock = new Date("2026-05-12T12:00:00.000Z");
const practiceId = "10000000-0000-4000-8000-000000000001";

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle({ client: pool });

async function seed() {
  await db.transaction(async (tx) => {
    await tx.delete(patientNotes);
    await tx.delete(appointments);
    await tx.delete(patients);
    await tx.delete(treatments);
    await tx.delete(practices);

    await tx.insert(practices).values({
      id: practiceId,
      name: "Atelier Dental",
      timezone: "America/Argentina/Buenos_Aires",
      createdAt: demoClock,
      updatedAt: demoClock,
    });

    await tx.insert(treatments).values([
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
    ]);

    await tx.insert(patients).values([
      {
        id: "30000000-0000-4000-8000-000000000001",
        practiceId,
        identifier: "AT-1001",
        firstName: "Alex",
        lastName: "Sample",
        email: "alex.sample@example.com",
        phone: "+54 11 0000-1001",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000002",
        practiceId,
        identifier: "AT-1002",
        firstName: "Casey",
        lastName: "Sample",
        email: "casey.sample@example.com",
        phone: "+54 11 0000-1002",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000003",
        practiceId,
        identifier: "AT-1003",
        firstName: "Jordan",
        lastName: "Sample",
        email: "jordan.sample@example.com",
        phone: "+54 11 0000-1003",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000004",
        practiceId,
        identifier: "AT-1004",
        firstName: "Taylor",
        lastName: "Sample",
        email: "taylor.sample@example.com",
        phone: "+54 11 0000-1004",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx.insert(appointments).values([
      {
        id: "40000000-0000-4000-8000-000000000001",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000001",
        treatmentId: "20000000-0000-4000-8000-000000000001",
        startsAt: new Date("2026-05-08T13:00:00.000Z"),
        durationMinutes: 30,
        status: "COMPLETED",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "40000000-0000-4000-8000-000000000002",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000002",
        treatmentId: "20000000-0000-4000-8000-000000000003",
        startsAt: new Date("2026-05-11T15:00:00.000Z"),
        durationMinutes: 60,
        status: "CANCELLED",
        note: "Cancelled before the scheduled time.",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "40000000-0000-4000-8000-000000000003",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000001",
        treatmentId: "20000000-0000-4000-8000-000000000002",
        startsAt: new Date("2026-05-12T12:30:00.000Z"),
        durationMinutes: 45,
        status: "SCHEDULED",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "40000000-0000-4000-8000-000000000004",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000003",
        treatmentId: "20000000-0000-4000-8000-000000000001",
        startsAt: new Date("2026-05-12T14:30:00.000Z"),
        durationMinutes: 30,
        status: "CONFIRMED",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "40000000-0000-4000-8000-000000000005",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000004",
        treatmentId: "20000000-0000-4000-8000-000000000003",
        startsAt: new Date("2026-05-13T12:00:00.000Z"),
        durationMinutes: 60,
        status: "SCHEDULED",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx.insert(patientNotes).values([
      {
        id: "50000000-0000-4000-8000-000000000001",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000001",
        treatmentId: "20000000-0000-4000-8000-000000000002",
        body: "Upcoming appointment details reviewed.",
        createdAt: new Date("2026-05-11T15:00:00.000Z"),
        updatedAt: new Date("2026-05-11T15:00:00.000Z"),
      },
      {
        id: "50000000-0000-4000-8000-000000000002",
        practiceId,
        patientId: "30000000-0000-4000-8000-000000000003",
        body: "Scheduling preference recorded for the next visit.",
        createdAt: new Date("2026-05-12T11:00:00.000Z"),
        updatedAt: new Date("2026-05-12T11:00:00.000Z"),
      },
    ]);
  });
}

seed()
  .then(() => {
    console.info("Seeded the DMS demo workspace.");
  })
  .finally(async () => {
    await pool.end();
  });
