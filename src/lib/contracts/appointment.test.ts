import { describe, expect, it } from "vitest";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "@/lib/contracts/appointment";

const validAppointment = {
  durationMinutes: 45,
  patientId: "30000000-0000-4000-8000-000000000001",
  startsAt: "2026-05-12T12:30:00.000Z",
  treatmentId: "20000000-0000-4000-8000-000000000002",
};

describe("appointment contracts", () => {
  it("normalizes a valid create payload into the canonical value types", () => {
    const result = createAppointmentSchema.parse({
      ...validAppointment,
      note: "  Confirmed by phone.  ",
    });

    expect(result).toMatchObject({
      durationMinutes: validAppointment.durationMinutes,
      note: "Confirmed by phone.",
      patientId: validAppointment.patientId,
      treatmentId: validAppointment.treatmentId,
    });
    expect(result.startsAt).toBeInstanceOf(Date);
    expect(result.startsAt.toISOString()).toBe(validAppointment.startsAt);
  });

  it("rejects invalid durations, identifiers, and unknown fields", () => {
    expect(
      createAppointmentSchema.safeParse({
        ...validAppointment,
        durationMinutes: 50,
      }).success,
    ).toBe(false);
    expect(
      createAppointmentSchema.safeParse({
        ...validAppointment,
        patientId: "not-a-uuid",
      }).success,
    ).toBe(false);
    expect(
      createAppointmentSchema.safeParse({
        ...validAppointment,
        unexpected: true,
      }).success,
    ).toBe(false);
  });

  it("requires a meaningful update and accepts only canonical statuses", () => {
    expect(updateAppointmentSchema.safeParse({}).success).toBe(false);
    expect(
      updateAppointmentSchema.safeParse({ status: "CONFIRMED" }).success,
    ).toBe(true);
    expect(
      updateAppointmentSchema.safeParse({ status: "RESCHEDULED" }).success,
    ).toBe(false);
  });
});
