import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { requireTestDatabaseUrl } from "@/lib/testing/test-database";

const practiceId = "70000000-0000-4000-8000-000000000001";
const firstPatientId = "70000000-0000-4000-8000-000000000002";
const secondPatientId = "70000000-0000-4000-8000-000000000003";
const treatmentId = "70000000-0000-4000-8000-000000000004";
const pool = new Pool({ connectionString: requireTestDatabaseUrl() });

async function insertAppointment(
  startsAt: string,
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
  durationMinutes = 30,
  patientId = firstPatientId,
) {
  return pool.query(
    `
      INSERT INTO appointments (
        id, practice_id, patient_id, treatment_id, starts_at, duration_minutes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::appointment_status)
    `,
    [
      randomUUID(),
      practiceId,
      patientId,
      treatmentId,
      startsAt,
      durationMinutes,
      status,
    ],
  );
}

beforeAll(async () => {
  await pool.query("SELECT 1");
});

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE practices CASCADE");
  await pool.query(
    "INSERT INTO practices (id, name, timezone) VALUES ($1, $2, $3)",
    [practiceId, "Integration Practice", "America/Argentina/Buenos_Aires"],
  );
  await pool.query(
    `
      INSERT INTO patients (id, practice_id, identifier, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5), ($6, $2, $7, $8, $9)
    `,
    [
      firstPatientId,
      practiceId,
      "IT-1001",
      "Alex",
      "Quinn",
      secondPatientId,
      "IT-1002",
      "Jordan",
      "Ellis",
    ],
  );
  await pool.query(
    `
      INSERT INTO treatments (
        id, practice_id, name, category, description, default_duration_minutes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      treatmentId,
      practiceId,
      "Integration treatment",
      "General dentistry",
      "A test-only treatment.",
      30,
    ],
  );
});

afterAll(async () => {
  await pool.end();
});

describe("PostgreSQL integration constraints", () => {
  it("rejects overlapping active appointments for a practice", async () => {
    await insertAppointment("2026-05-12T12:00:00.000Z", "SCHEDULED", 60);

    await expect(
      insertAppointment(
        "2026-05-12T12:30:00.000Z",
        "CONFIRMED",
        30,
        secondPatientId,
      ),
    ).rejects.toMatchObject({ code: "23P01" });
  });

  it("allows a back-to-back appointment and a cancelled overlap", async () => {
    await insertAppointment("2026-05-12T12:00:00.000Z", "SCHEDULED", 30);

    await expect(
      insertAppointment(
        "2026-05-12T12:30:00.000Z",
        "CONFIRMED",
        30,
        secondPatientId,
      ),
    ).resolves.toBeDefined();
    await expect(
      insertAppointment(
        "2026-05-12T12:00:00.000Z",
        "CANCELLED",
        30,
        secondPatientId,
      ),
    ).resolves.toBeDefined();
  });

  it("enforces a practice-scoped unique patient identifier", async () => {
    await expect(
      pool.query(
        `
          INSERT INTO patients (id, practice_id, identifier, first_name, last_name)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [randomUUID(), practiceId, "IT-1001", "Morgan", "Vale"],
      ),
    ).rejects.toMatchObject({ code: "23505" });
  });

  it("retains a note when its optional treatment is removed", async () => {
    const noteId = randomUUID();
    await pool.query(
      `
        INSERT INTO patient_notes (id, practice_id, patient_id, treatment_id, body)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [noteId, practiceId, firstPatientId, treatmentId, "Test note."],
    );

    await pool.query("DELETE FROM treatments WHERE id = $1", [treatmentId]);
    const result = await pool.query<{ treatment_id: string | null }>(
      "SELECT treatment_id FROM patient_notes WHERE id = $1",
      [noteId],
    );

    expect(result.rows).toEqual([{ treatment_id: null }]);
  });
});
