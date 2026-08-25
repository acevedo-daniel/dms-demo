export const practiceTimeZone = "America/Argentina/Buenos_Aires";
export const scheduleStartHour = 9;
export const scheduleEndHour = 18;
export const scheduleSlotMinutes = 30;
export const scheduleSlotsPerDay =
  ((scheduleEndHour - scheduleStartHour) * 60) / scheduleSlotMinutes;

const weekdayNumbers = new Map([
  ["Mon", 1],
  ["Tue", 2],
  ["Wed", 3],
  ["Thu", 4],
  ["Fri", 5],
  ["Sat", 6],
  ["Sun", 7],
]);

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
  const offsetMilliseconds = (Number(hours) * 60 + Number(minutes)) * 60 * 1000;

  return sign === "+" ? offsetMilliseconds : -offsetMilliseconds;
}

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: practiceTimeZone,
    year: "numeric",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as { day: number; month: number; year: number };
}

function createPracticeDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
) {
  const utcCandidate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return new Date(utcCandidate.getTime() - getTimeZoneOffset(utcCandidate));
}

export function addPracticeDays(date: Date, days: number) {
  const parts = getDateParts(date);
  const calendarDate = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + days),
  );

  return createPracticeDate(
    calendarDate.getUTCFullYear(),
    calendarDate.getUTCMonth() + 1,
    calendarDate.getUTCDate(),
  );
}

export function scheduleWeekStart(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: practiceTimeZone,
    weekday: "short",
  }).format(date);
  const weekdayNumber = weekdayNumbers.get(weekday);

  if (!weekdayNumber) {
    throw new Error("Unable to resolve the practice weekday.");
  }

  return addPracticeDays(date, 1 - weekdayNumber);
}

export function parseScheduleWeek(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const candidate = createPracticeDate(year, month, day);
  const parts = getDateParts(candidate);

  if (parts.year !== year || parts.month !== month || parts.day !== day) {
    return null;
  }

  return scheduleWeekStart(candidate).getTime() === candidate.getTime()
    ? candidate
    : null;
}

export function scheduleWeekKey(date: Date) {
  const { day, month, year } = getDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function scheduleWeekDays(weekStart: Date) {
  return Array.from({ length: 5 }, (_, index) =>
    addPracticeDays(weekStart, index),
  );
}

export function scheduleSlotStart(day: Date, slotIndex: number) {
  const { day: dayOfMonth, month, year } = getDateParts(day);
  const minutes = scheduleStartHour * 60 + slotIndex * scheduleSlotMinutes;

  return createPracticeDate(
    year,
    month,
    dayOfMonth,
    Math.floor(minutes / 60),
    minutes % 60,
  );
}

export function practiceDateInputValue(date: Date) {
  const { day, month, year } = getDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function practiceTimeInputValue(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: practiceTimeZone,
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.hour}:${values.minute}`;
}

export function toPracticeDateTime(date: string, time: string) {
  const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = time.match(/^(\d{2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  return createPracticeDate(
    Number(dateMatch[1]),
    Number(dateMatch[2]),
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
}
