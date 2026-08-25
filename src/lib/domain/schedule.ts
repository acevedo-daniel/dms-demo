import { ConflictError } from "@/lib/domain/errors";

const argentinaTimeZone = "America/Argentina/Buenos_Aires";
const weekdayNumbers = new Map([
  ["Mon", 1],
  ["Tue", 2],
  ["Wed", 3],
  ["Thu", 4],
  ["Fri", 5],
  ["Sat", 6],
  ["Sun", 7],
]);

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  timeZone: argentinaTimeZone,
  weekday: "short",
});

export const activeAppointmentStatuses = ["SCHEDULED", "CONFIRMED"] as const;

export function appointmentEnd(startsAt: Date, durationMinutes: number) {
  return new Date(startsAt.getTime() + durationMinutes * 60_000);
}

export function assertScheduleSlot(startsAt: Date, durationMinutes: number) {
  const parts = Object.fromEntries(
    timeFormatter
      .formatToParts(startsAt)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const weekday = weekdayNumbers.get(parts.weekday);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const end = appointmentEnd(startsAt, durationMinutes);
  const endParts = Object.fromEntries(
    timeFormatter
      .formatToParts(end)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  if (!weekday || weekday > 5) {
    throw new ConflictError(
      "Appointments are available Monday through Friday.",
    );
  }

  if (minute !== 0 && minute !== 30) {
    throw new ConflictError("Appointments must begin on a 30-minute slot.");
  }

  if (
    hour < 9 ||
    hour >= 18 ||
    endParts.weekday !== parts.weekday ||
    Number(endParts.hour) > 18 ||
    (Number(endParts.hour) === 18 && Number(endParts.minute) > 0)
  ) {
    throw new ConflictError("Appointments must fit within 09:00–18:00.");
  }
}

export function assertAppointmentTransition(current: string, next: string) {
  if (current === next) {
    return;
  }

  const transitions: Record<string, readonly string[]> = {
    CONFIRMED: ["COMPLETED", "CANCELLED"],
    SCHEDULED: ["CONFIRMED", "COMPLETED", "CANCELLED"],
  };

  if (!transitions[current]?.includes(next)) {
    throw new ConflictError("This appointment status cannot be changed.");
  }
}
