export const DEMO_ADMIN_ROLE = "demo_admin" as const;
export const DEMO_PRACTICE_ID = "10000000-0000-4000-8000-000000000001";
export const DEMO_ADMIN_NAME = "DMS Demo";
export const DEMO_CLOCK_ISO = "2026-05-12T12:00:00.000Z";

export function getDemoClock() {
  return new Date(DEMO_CLOCK_ISO);
}
