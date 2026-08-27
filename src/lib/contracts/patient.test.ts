import { describe, expect, it } from "vitest";
import { createPatientSchema } from "@/lib/contracts/patient";

describe("patient contracts", () => {
  it("trims identity fields and normalizes blank optional contact data", () => {
    expect(
      createPatientSchema.parse({
        email: "   ",
        firstName: "  Alex ",
        identifier: " AT-2001 ",
        lastName: " Quinn  ",
        phone: "",
      }),
    ).toEqual({
      email: undefined,
      firstName: "Alex",
      identifier: "AT-2001",
      lastName: "Quinn",
      phone: undefined,
    });
  });

  it("rejects missing identity fields and unknown properties", () => {
    expect(
      createPatientSchema.safeParse({
        firstName: "Alex",
        identifier: "AT-2001",
        lastName: "",
      }).success,
    ).toBe(false);
    expect(
      createPatientSchema.safeParse({
        firstName: "Alex",
        identifier: "AT-2001",
        lastName: "Quinn",
        status: "ACTIVE",
      }).success,
    ).toBe(false);
  });
});
