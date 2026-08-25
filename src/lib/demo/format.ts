const practiceTimeZone = "America/Argentina/Buenos_Aires";

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
