import { ScheduleBoard } from "@/components/schedule-board";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDemoClock } from "@/lib/demo/constants";
import { parseScheduleWeek, scheduleWeekStart } from "@/lib/demo/schedule";
import {
  getActiveScheduleAppointment,
  getScheduleData,
} from "@/lib/schedule-data";

type SchedulePageProps = {
  searchParams: Promise<{
    appointment?: string;
    create?: string;
    patient?: string;
    treatment?: string;
    operatory?: string;
    week?: string;
  }>;
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
  const selectedAppointment = await getActiveScheduleAppointment(
    parameters.appointment,
  );
  const weekStart = selectedAppointment
    ? scheduleWeekStart(new Date(selectedAppointment.startsAt))
    : (parseScheduleWeek(parameters.week) ?? scheduleWeekStart(getDemoClock()));
  const schedule = await loadSchedule(weekStart);

  if (!schedule) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="schedule-error-title"
          className="max-w-lg border-y border-border py-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Schedule
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="schedule-error-title"
          >
            The schedule could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again.
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
  const treatmentIsAvailable = schedule.treatments.some(
    (treatment) => treatment.id === parameters.treatment,
  );
  const initialOperatory =
    parameters.operatory === "1" || parameters.operatory === "2"
      ? parameters.operatory
      : "ALL";

  return (
    <main className="mx-auto w-full max-w-[var(--schedule-workspace-max)] px-4 py-8 sm:px-6 lg:px-8">
      <ScheduleBoard
        appointments={schedule.appointments}
        initialAppointmentId={selectedAppointment?.id}
        initialCreate={parameters.create === "1" && !selectedAppointment}
        initialPatientId={
          parameters.create === "1" &&
          patientIsAvailable &&
          !selectedAppointment
            ? parameters.patient
            : undefined
        }
        initialOperatory={initialOperatory}
        initialTreatmentId={
          parameters.create === "1" &&
          treatmentIsAvailable &&
          !selectedAppointment
            ? parameters.treatment
            : undefined
        }
        key={`${weekStart.toISOString()}:${selectedAppointment?.id ?? ""}:${parameters.create ?? ""}:${parameters.patient ?? ""}:${parameters.treatment ?? ""}:${initialOperatory}`}
        patients={schedule.patients}
        treatments={schedule.treatments}
        weekStart={weekStart.toISOString()}
      />
    </main>
  );
}
