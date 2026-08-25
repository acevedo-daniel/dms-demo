import { ScheduleBoard } from "@/components/schedule-board";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDemoClock } from "@/lib/demo/constants";
import { parseScheduleWeek, scheduleWeekStart } from "@/lib/demo/schedule";
import { getScheduleData } from "@/lib/schedule-data";

type SchedulePageProps = {
  searchParams: Promise<{ create?: string; patient?: string; week?: string }>;
};

async function loadSchedule(week: Date) {
  try {
    return await getScheduleData(week);
  } catch {
    return null;
  }
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const parameters = await searchParams;
  const weekStart =
    parseScheduleWeek(parameters.week) ?? scheduleWeekStart(getDemoClock());
  const schedule = await loadSchedule(weekStart);

  if (!schedule) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="schedule-error-title"
          className="max-w-lg border-y border-border py-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Schedule
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="schedule-error-title"
          >
            The schedule could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Try again after the demo database connection is available.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/demo/schedule">Try again</Link>
          </Button>
        </section>
      </main>
    );
  }

  const patientIsAvailable = schedule.patients.some(
    (patient) => patient.id === parameters.patient,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ScheduleBoard
        appointments={schedule.appointments}
        initialPatientId={patientIsAvailable ? parameters.patient : undefined}
        initialSheetOpen={parameters.create === "1"}
        patients={schedule.patients}
        treatments={schedule.treatments}
        weekStart={weekStart.toISOString()}
      />
    </main>
  );
}
