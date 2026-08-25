CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_active_time_range_exclusion"
EXCLUDE USING gist (
  "practice_id" WITH =,
  tsrange(
    "starts_at" AT TIME ZONE 'UTC',
    ("starts_at" AT TIME ZONE 'UTC') + make_interval(mins => "duration_minutes"),
    '[)'
  ) WITH &&
)
WHERE ("status" IN ('SCHEDULED', 'CONFIRMED'));
