import { describe, expect, it } from "vitest";
import { createPatientNoteSchema } from "@/lib/contracts/note";

describe("patient note contracts", () => {
  it("normalizes an empty treatment selection to an omitted association", () => {
    expect(
      createPatientNoteSchema.parse({
        body: "  Appointment preparation reviewed.  ",
        patientId: "30000000-0000-4000-8000-000000000001",
        treatmentId: "",
      }),
    ).toEqual({
      body: "Appointment preparation reviewed.",
      patientId: "30000000-0000-4000-8000-000000000001",
      treatmentId: undefined,
    });
  });

  it("rejects an empty note or malformed relationships", () => {
    expect(
      createPatientNoteSchema.safeParse({
        body: "   ",
        patientId: "30000000-0000-4000-8000-000000000001",
      }).success,
    ).toBe(false);
    expect(
      createPatientNoteSchema.safeParse({
        body: "A note",
        patientId: "not-a-uuid",
      }).success,
    ).toBe(false);
  });
});
