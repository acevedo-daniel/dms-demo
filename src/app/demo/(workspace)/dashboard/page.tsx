import { CalendarPlus, Clock3, FileText } from "lucide-react";
import Link from "next/link";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { ConfirmAppointmentButton } from "@/components/confirm-appointment-button";
import { ExploreDmsGuide } from "@/components/explore-dms-guide";
import { Button } from "@/components/ui/button";
import {
  formatDemoDate,
  formatDemoTime,
  getDashboardData,
  type DashboardAppointmentStatus,
} from "@/lib/dashboard";
import { getDemoClock } from "@/lib/demo/constants";
import { scheduleWeekKey, scheduleWeekStart } from "@/lib/demo/schedule";

function AppointmentStatus({ status }: { status: DashboardAppointmentStatus }) {
  return <AppointmentStatusBadge status={status} />;
}

async function loadDashboard() {
  try {
    return await getDashboardData();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const dashboard = await loadDashboard();

  if (!dashboard) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="dashboard-error-title"
          className="max-w-lg border-y border-border py-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Today
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="dashboard-error-title"
          >
            The workspace data could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/demo/dashboard">Try again</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Daily operating view
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
            Today
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDemoDate(getDemoClock())}
          </p>
        </div>
        <Button asChild className="hidden md:inline-flex">
          <Link href="/demo/schedule?create=1">
            <CalendarPlus aria-hidden className="size-4" />
            Create appointment
          </Link>
        </Button>
      </header>

      <section aria-labelledby="today-title" className="pt-9">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              className="text-xl font-semibold tracking-tight"
              id="today-title"
              tabIndex={-1}
            >
              Today
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A chronological view of the demo day.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {dashboard.today.length} active
          </span>
        </div>

        {dashboard.today.length ? (
          <>
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {dashboard.today.map((appointment) => (
                <li
                  className="grid gap-4 py-5 sm:grid-cols-[5.25rem_minmax(0,1fr)_auto] sm:items-center"
                  key={appointment.id}
                >
                  <time
                    className="font-mono text-sm font-medium tabular-nums text-foreground"
                    dateTime={appointment.startsAt.toISOString()}
                  >
                    {formatDemoTime(appointment.startsAt)}
                  </time>
                  <div className="min-w-0">
                    <Link
                      className="font-medium text-foreground hover:text-primary"
                      href={`/demo/patients/${appointment.patientId}`}
                    >
                      {appointment.patientName}
                    </Link>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {appointment.treatmentName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AppointmentStatus status={appointment.status} />
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={`/demo/schedule?week=${scheduleWeekKey(scheduleWeekStart(appointment.startsAt))}&appointment=${appointment.id}`}
                      >
                        Open in schedule
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex justify-end">
              <Button asChild variant="ghost">
                <Link href="/demo/schedule">Open schedule</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-5 border-y border-border py-12 text-center">
            <Clock3
              aria-hidden
              className="mx-auto size-5 text-muted-foreground"
            />
            <p className="mt-3 font-medium">
              No appointments are scheduled for today.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an appointment from the schedule workspace.
            </p>
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
        {dashboard.needsAttention.length ? (
          <section aria-labelledby="attention-title">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-semibold tracking-tight"
                  id="attention-title"
                >
                  Needs attention
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scheduled appointments awaiting confirmation.
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {dashboard.needsAttention.length} scheduled
              </span>
            </div>
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {dashboard.needsAttention.map((appointment) => (
                <li
                  className="flex items-center justify-between gap-4 py-4"
                  key={appointment.id}
                >
                  <div className="min-w-0">
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDemoTime(appointment.startsAt)} ·{" "}
                      {appointment.treatmentName}
                    </p>
                  </div>
                  <ConfirmAppointmentButton
                    appointmentId={appointment.id}
                    patientName={appointment.patientName}
                  />
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section aria-labelledby="notes-title">
          <div>
            <h2
              className="text-xl font-semibold tracking-tight"
              id="notes-title"
            >
              Recent notes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Operational context recorded in the workspace.
            </p>
          </div>
          {dashboard.recentNotes.length ? (
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {dashboard.recentNotes.map((note) => (
                <li className="py-4" key={note.id}>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-medium">{note.patientName}</span>
                    {note.treatmentName ? (
                      <span className="text-muted-foreground">
                        · {note.treatmentName}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground">
                    {note.body}
                  </p>
                  <time
                    className="mt-2 block font-mono text-xs text-muted-foreground"
                    dateTime={note.createdAt.toISOString()}
                  >
                    {formatDemoDate(note.createdAt)}
                  </time>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-5 border-y border-border py-12 text-center">
              <FileText
                aria-hidden
                className="mx-auto size-5 text-muted-foreground"
              />
              <p className="mt-3 font-medium">No recent notes are available.</p>
            </div>
          )}
        </section>
      </div>

      <ExploreDmsGuide />
    </main>
  );
}
