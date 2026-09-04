import { CalendarPlus, Clock3, FileText, MapPin } from "lucide-react";
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

type TodayAppointment = Awaited<
  ReturnType<typeof getDashboardData>
>["today"][number];

function scheduleHref(appointment: TodayAppointment) {
  return `/demo/schedule?week=${scheduleWeekKey(scheduleWeekStart(appointment.startsAt))}&appointment=${appointment.id}`;
}

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
            {formatDemoDate(getDemoClock())} · Practice time{" "}
            {formatDemoTime(getDemoClock())}
          </p>
        </div>
        <Button asChild>
          <Link href="/demo/schedule?create=1">
            <CalendarPlus aria-hidden className="size-4" />
            Create appointment
          </Link>
        </Button>
      </header>

      <section aria-labelledby="up-next-title" className="pt-8">
        {dashboard.upNext ? (
          <div className="rounded-[var(--radius-md)] border border-border border-l-4 border-l-accent bg-surface p-5 shadow-xs sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Up next
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <time
                  className="font-mono text-xl font-semibold tabular-nums"
                  dateTime={dashboard.upNext.startsAt.toISOString()}
                >
                  {formatDemoTime(dashboard.upNext.startsAt)}
                </time>
                <h2
                  className="text-xl font-semibold tracking-tight"
                  id="up-next-title"
                >
                  <Link
                    className="hover:text-primary"
                    href={`/demo/patients/${dashboard.upNext.patientId}`}
                  >
                    {dashboard.upNext.patientName}
                  </Link>
                </h2>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link
                  className="hover:text-primary"
                  href={`/demo/treatments?treatment=${dashboard.upNext.treatmentId}`}
                >
                  {dashboard.upNext.treatmentName}
                </Link>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin aria-hidden className="size-3.5" />
                  Room assignment pending
                </span>
                <AppointmentStatus status={dashboard.upNext.status} />
              </div>
            </div>
            <div className="mt-5 flex shrink-0 flex-wrap gap-2 sm:mt-0">
              {dashboard.upNext.status === "SCHEDULED" ? (
                <ConfirmAppointmentButton
                  appointmentId={dashboard.upNext.id}
                  patientName={dashboard.upNext.patientName}
                />
              ) : null}
              <Button asChild size="sm" variant="outline">
                <Link href={scheduleHref(dashboard.upNext)}>
                  Open in schedule
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-y border-border py-6">
            <h2 className="font-medium" id="up-next-title">
              All appointments for today have been completed.
            </h2>
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(17rem,.75fr)]">
        <section aria-labelledby="today-agenda-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Operating day
              </p>
              <h2
                className="mt-3 text-xl font-semibold tracking-tight"
                id="today-agenda-title"
                tabIndex={-1}
              >
                Today&apos;s agenda
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {dashboard.today.length} active
            </span>
          </div>

          {dashboard.today.length ? (
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
                    <Link
                      className="mt-1 block truncate text-sm text-muted-foreground hover:text-primary"
                      href={`/demo/treatments?treatment=${appointment.treatmentId}`}
                    >
                      {appointment.treatmentName}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <AppointmentStatus status={appointment.status} />
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        aria-label={`Open ${appointment.patientName} at ${formatDemoTime(appointment.startsAt)} in schedule`}
                        href={scheduleHref(appointment)}
                      >
                        Open in schedule
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-5 border-y border-border py-12 text-center">
              <Clock3
                aria-hidden
                className="mx-auto size-5 text-muted-foreground"
              />
              <p className="mt-3 font-medium">
                No appointments are scheduled for today.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/demo/schedule?create=1">Create appointment</Link>
              </Button>
            </div>
          )}
        </section>

        {dashboard.needsAttention.length ? (
          <section
            aria-labelledby="attention-title"
            className="border-y border-border py-5 xl:self-start"
          >
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Follow-up queue
            </p>
            <h2
              className="mt-3 text-xl font-semibold tracking-tight"
              id="attention-title"
            >
              Needs attention
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Scheduled appointments awaiting confirmation.
            </p>
            <ol className="mt-4 divide-y divide-border">
              {dashboard.needsAttention.map((appointment) => (
                <li className="py-4" key={appointment.id}>
                  <Link
                    className="font-medium hover:text-primary"
                    href={`/demo/patients/${appointment.patientId}`}
                  >
                    {appointment.patientName}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDemoTime(appointment.startsAt)} ·{" "}
                    {appointment.treatmentName}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ConfirmAppointmentButton
                      appointmentId={appointment.id}
                      patientName={appointment.patientName}
                    />
                    <Button asChild size="sm" variant="ghost">
                      <Link href={scheduleHref(appointment)}>Open</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      <section
        aria-labelledby="recent-notes-title"
        className="mt-10 border-t border-border pt-10"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Shared context
            </p>
            <h2
              className="mt-3 text-xl font-semibold tracking-tight"
              id="recent-notes-title"
            >
              Recent notes
            </h2>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/demo/notes">Open notes</Link>
          </Button>
        </div>
        {dashboard.recentNotes.length ? (
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {dashboard.recentNotes.map((note) => (
              <li className="py-4" key={note.id}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <Link
                    className="font-medium text-foreground hover:text-primary"
                    href={`/demo/patients/${note.patientId}`}
                  >
                    {note.patientName}
                  </Link>
                  {note.treatmentName && note.treatmentId ? (
                    <Link
                      className="text-muted-foreground hover:text-primary"
                      href={`/demo/treatments?treatment=${note.treatmentId}`}
                    >
                      · {note.treatmentName}
                    </Link>
                  ) : null}
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground">
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

      <ExploreDmsGuide />
    </main>
  );
}
