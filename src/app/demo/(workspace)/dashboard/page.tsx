import { CalendarPlus, Clock3, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { ConfirmAppointmentButton } from "@/components/confirm-appointment-button";
import { ExploreDmsGuide } from "@/components/explore-dms-guide";
import { Badge } from "@/components/ui/badge";
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

function getPatientInitials(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "PT"
  );
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
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
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
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary">
              Daily Operating View
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground">
            Today
          </h1>
          <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-medium text-foreground">
              {formatDemoDate(getDemoClock())}
            </span>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span className="text-xs text-muted-foreground">
              Practice time{" "}
              <span className="font-mono font-medium text-foreground/80">
                {formatDemoTime(getDemoClock())}
              </span>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="h-10 px-4 font-semibold shadow-xs">
            <Link href="/demo/schedule?create=1">
              <CalendarPlus aria-hidden className="size-4" />
              Create appointment
            </Link>
          </Button>
        </div>
      </header>

      <section aria-labelledby="up-next-title" className="pt-8">
        {dashboard.upNext ? (
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-7 shadow-xs sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Up next
                </span>
                <span className="inline-flex size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
                <time
                  className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl"
                  dateTime={dashboard.upNext.startsAt.toISOString()}
                >
                  {formatDemoTime(dashboard.upNext.startsAt)}
                </time>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getPatientInitials(dashboard.upNext.patientName)}
                  </span>
                  <h2
                    className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                    id="up-next-title"
                  >
                    <Link
                      className="transition-colors hover:text-primary"
                      href={`/demo/patients/${dashboard.upNext.patientId}`}
                    >
                      {dashboard.upNext.patientName}
                    </Link>
                  </h2>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
                <Link
                  className="font-medium text-foreground transition-colors hover:text-primary"
                  href={`/demo/treatments?treatment=${dashboard.upNext.treatmentId}`}
                >
                  {dashboard.upNext.treatmentName}
                </Link>
                <span aria-hidden className="text-muted-foreground/40">
                  ·
                </span>
                <Badge
                  className="gap-1 text-xs font-normal text-muted-foreground"
                  variant="secondary"
                >
                  <MapPin
                    aria-hidden
                    className="size-3 text-muted-foreground"
                  />
                  Room assignment pending
                </Badge>
                <AppointmentStatus status={dashboard.upNext.status} />
              </div>
            </div>
            <div className="mt-6 flex shrink-0 flex-wrap items-center gap-2.5 sm:mt-0">
              {dashboard.upNext.status === "SCHEDULED" ? (
                <ConfirmAppointmentButton
                  appointmentId={dashboard.upNext.id}
                  patientName={dashboard.upNext.patientName}
                  size="sm"
                />
              ) : null}
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-border/80"
              >
                <Link href={scheduleHref(dashboard.upNext)}>
                  Open in schedule
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 text-center sm:text-left">
            <h2
              className="text-base font-semibold text-foreground"
              id="up-next-title"
            >
              All appointments for today have been completed.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review completed encounters or open the master schedule.
            </p>
          </div>
        )}
      </section>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,.8fr)]">
        <section aria-labelledby="today-agenda-title">
          <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Operating day
              </p>
              <h2
                className="mt-2 text-xl font-semibold tracking-tight text-foreground"
                id="today-agenda-title"
                tabIndex={-1}
              >
                Today&apos;s agenda
              </h2>
            </div>
            <span className="rounded-full border border-border/70 bg-secondary/60 px-3 py-0.5 text-xs font-medium text-muted-foreground">
              {dashboard.today.length} active
            </span>
          </div>

          {dashboard.today.length ? (
            <ol className="mt-4 divide-y divide-border/70 border-y border-border/80">
              {dashboard.today.map((appointment) => (
                <li
                  className="-mx-3 grid gap-3 rounded-[var(--radius-md)] px-3 py-4 transition-all duration-150 hover:bg-secondary/40 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center"
                  key={appointment.id}
                >
                  <time
                    className="font-mono text-sm font-semibold tabular-nums text-foreground"
                    dateTime={appointment.startsAt.toISOString()}
                  >
                    {formatDemoTime(appointment.startsAt)}
                  </time>
                  <div className="min-w-0">
                    <Link
                      className="truncate font-semibold text-foreground transition-colors hover:text-primary"
                      href={`/demo/patients/${appointment.patientId}`}
                    >
                      {appointment.patientName}
                    </Link>
                    <Link
                      className="mt-0.5 block truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                      href={`/demo/treatments?treatment=${appointment.treatmentId}`}
                    >
                      {appointment.treatmentName}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <AppointmentStatus status={appointment.status} />
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-xs hover:bg-secondary"
                    >
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
            <div className="mt-6 rounded-[var(--radius-md)] border border-border/70 bg-card/30 py-12 text-center">
              <Clock3
                aria-hidden
                className="mx-auto size-5 text-muted-foreground"
              />
              <p className="mt-3 font-medium text-foreground">
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
            className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 sm:p-6 xl:self-start shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Follow-up queue
                </p>
                <h2
                  className="mt-1 text-lg font-semibold tracking-tight text-foreground"
                  id="attention-title"
                >
                  Needs attention
                </h2>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                {dashboard.needsAttention.length}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Scheduled appointments awaiting confirmation.
            </p>
            <ol className="mt-4 divide-y divide-border/60">
              {dashboard.needsAttention.map((appointment) => (
                <li
                  className="-mx-2 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-secondary/40"
                  key={appointment.id}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      className="truncate font-medium text-sm text-foreground transition-colors hover:text-primary"
                      href={`/demo/patients/${appointment.patientId}`}
                    >
                      {appointment.patientName}
                    </Link>
                    <time
                      className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
                      dateTime={appointment.startsAt.toISOString()}
                    >
                      {formatDemoTime(appointment.startsAt)}
                    </time>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {appointment.treatmentName}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ConfirmAppointmentButton
                      appointmentId={appointment.id}
                      patientName={appointment.patientName}
                      size="sm"
                    />
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                    >
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
        className="mt-14 border-t border-border/80 pt-10"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-primary">Shared Context</span>
              <span className="text-muted-foreground/40">·</span>
              <span>Clinical Handover</span>
            </div>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-foreground"
              id="recent-notes-title"
            >
              Recent notes
            </h2>
          </div>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-xs hover:bg-secondary"
          >
            <Link href="/demo/notes">Open notes</Link>
          </Button>
        </div>
        {dashboard.recentNotes.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.recentNotes.map((note) => (
              <div
                className="flex flex-col justify-between rounded-[var(--radius-md)] border border-border/70 bg-card/40 p-4 transition-all hover:border-foreground/20 hover:bg-card hover:shadow-xs"
                key={note.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <Link
                      className="font-semibold text-foreground transition-colors hover:text-primary"
                      href={`/demo/patients/${note.patientId}`}
                    >
                      {note.patientName}
                    </Link>
                    {note.treatmentName && note.treatmentId ? (
                      <Link
                        className="max-w-[140px] truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                        href={`/demo/treatments?treatment=${note.treatmentId}`}
                      >
                        · {note.treatmentName}
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-foreground/90">
                    {note.body}
                  </p>
                </div>
                <time
                  className="mt-4 block text-xs text-muted-foreground"
                  dateTime={note.createdAt.toISOString()}
                >
                  {formatDemoDate(note.createdAt)}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[var(--radius-md)] border border-border/70 bg-card/30 py-12 text-center">
            <FileText
              aria-hidden
              className="mx-auto size-5 text-muted-foreground"
            />
            <p className="mt-3 font-medium text-foreground">
              No recent notes are available.
            </p>
          </div>
        )}
      </section>

      <ExploreDmsGuide />
    </main>
  );
}
