import { describe, expect, it } from "vitest";
import { ConflictError } from "@/lib/domain/errors";
import {
  assertAppointmentTransition,
  assertScheduleSlot,
} from "@/lib/domain/schedule";

describe("schedule rules", () => {
  it("accepts a weekday appointment that fits the working day", () => {
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T12:30:00.000Z"), 45),
    ).not.toThrow();
  });

  it("accepts the first slot and a slot that ends exactly at closing time", () => {
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T12:00:00.000Z"), 30),
    ).not.toThrow();
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T20:30:00.000Z"), 30),
    ).not.toThrow();
  });

  it("rejects appointments outside the working week and hours", () => {
    expect(() =>
      assertScheduleSlot(new Date("2026-05-16T12:00:00.000Z"), 30),
    ).toThrow(ConflictError);
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T21:00:00.000Z"), 30),
    ).toThrow(ConflictError);
  });

  it("rejects a slot that exceeds the end of the day", () => {
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T20:30:00.000Z"), 60),
    ).toThrow("Appointments must fit within 09:00–18:00.");
  });

  it("rejects a start that is not aligned to a half-hour boundary", () => {
    expect(() =>
      assertScheduleSlot(new Date("2026-05-12T12:15:00.000Z"), 30),
    ).toThrow("Appointments must begin on a 30-minute slot.");
  });

  it("allows only the defined appointment lifecycle", () => {
    expect(() =>
      assertAppointmentTransition("SCHEDULED", "CONFIRMED"),
    ).not.toThrow();
    expect(() =>
      assertAppointmentTransition("CONFIRMED", "COMPLETED"),
    ).not.toThrow();
    expect(() => assertAppointmentTransition("COMPLETED", "SCHEDULED")).toThrow(
      ConflictError,
    );
    expect(() => assertAppointmentTransition("CANCELLED", "CONFIRMED")).toThrow(
      ConflictError,
    );
  });
});
