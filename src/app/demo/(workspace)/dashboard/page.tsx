import type { Metadata } from "next";
import { CalendarPlus, Clock, Clock3, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { ConfirmAppointmentButton } from "@/components/confirm-appointment-button";
import { ArriveAppointmentButton } from "@/components/arrive-appointment-button";
import { DailyHuddleDialog } from "@/components/daily-huddle-dialog";
import { ExploreDmsGuide } from "@/components/explore-dms-guide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { getDemoClock } from "@/lib/demo/constants";
import { getServerTranslations } from "@/lib/i18n/server";
import { getLocalizedTreatment } from "@/lib/i18n";
import { getLocalizedPatientNote } from "@/lib/i18n/demo-content";
import {
  getDashboardData,
  type DashboardAppointmentStatus,
} from "@/lib/dashboard";
import { scheduleWeekKey, scheduleWeekStart } from "@/lib/demo/schedule";

type TodayAppointment = Awaited<
  ReturnType<typeof getDashboardData>
>["today"][number];

function scheduleHref(appointment: TodayAppointment) {
  return `/demo/schedule?week=${scheduleWeekKey(scheduleWeekStart(appointment.startsAt))}&appointment=${appointment.id}`;
}

function AppointmentStatus({
  locale,
  status,
}: {
  locale?: "es" | "en";
  status: DashboardAppointmentStatus;
}) {
  return <AppointmentStatusBadge locale={locale} status={status} />;
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

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();

  return {
    title: t.dashboard.metaTitle,
    description: t.dashboard.metaDescription,
  };
}

export default async function DashboardPage() {
  const [{ locale, t }, dashboard] = await Promise.all([
    getServerTranslations(),
    loadDashboard(),
  ]);

  if (!dashboard) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="dashboard-error-title"
          className="max-w-lg rounded-[var(--radius-xl)] border border-border/80 bg-card/60 p-8 sm:p-10 shadow-xs backdrop-blur-xs"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t.nav.today}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground"
            id="dashboard-error-title"
          >
            {locale === "es"
              ? "No se pudieron cargar los datos del espacio."
              : "Could not load workspace data."}
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            {locale === "es"
              ? "Los datos de muestra no están disponibles temporalmente. Reintente para recargar la agenda del día."
              : "Sample data is temporarily unavailable. Retry to reload today's schedule."}
          </p>
          <Button
            asChild
            className="mt-6 font-semibold shadow-xs"
            variant="outline"
          >
            <Link href="/demo/dashboard">
              {locale === "es" ? "Reintentar" : "Retry"}
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const upNextTreatment = dashboard.upNext
    ? getLocalizedTreatment(
        {
          id: dashboard.upNext.treatmentId,
          name: dashboard.upNext.treatmentName,
        },
        locale,
      )
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {locale === "es"
                ? "Vista operativa diaria"
                : "Daily operational view"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-medium text-foreground">Atelier Dental</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground">
            {t.nav.today}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-semibold text-foreground">
              {formatDemoDate(getDemoClock(), locale)}
            </span>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span className="text-xs text-muted-foreground">
              {locale === "es" ? "Hora de clínica" : "Practice time"}{" "}
              <span className="font-mono font-medium text-foreground">
                {formatDemoTime(getDemoClock(), locale)}
              </span>
            </span>
            <span
              aria-hidden
              className="text-muted-foreground/40 hidden sm:inline"
            >
              ·
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="size-1.5 rounded-full bg-accent" />
              {locale === "es"
                ? "Sesión clínica activa"
                : "Active clinical session"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DailyHuddleDialog
            appointments={dashboard.today.map((appointment) => ({
              ...appointment,
              startsAt: appointment.startsAt.toISOString(),
            }))}
          />
          <Button asChild className="h-10 px-4 font-semibold shadow-xs">
            <Link href="/demo/schedule?create=1">
              <CalendarPlus aria-hidden className="size-4" />
              {locale === "es" ? "Nuevo turno" : "New appointment"}
            </Link>
          </Button>
        </div>
      </header>

      {/* Clinical Daily Practice Ledger Strip */}
      <div className="mt-6 grid grid-cols-1 divide-y divide-border/60 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Agenda del día" : "Today's Schedule"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {dashboard.today.length}{" "}
            {locale === "es"
              ? dashboard.today.length === 1
                ? "Consulta"
                : "Consultas"
              : dashboard.today.length === 1
                ? "Visit"
                : "Visits"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "09:00 – 16:30 jornada clínica"
              : "09:00 – 16:30 clinical day"}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5">
            {dashboard.needsAttention.length ? (
              <span className="size-1.5 rounded-full bg-warning" />
            ) : (
              <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            )}
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "es"
                ? "Seguimiento de recepción"
                : "Front Desk Tracking"}
            </p>
          </div>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {dashboard.needsAttention.length}{" "}
            {locale === "es" ? "por confirmar" : "to confirm"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {dashboard.needsAttention.length
              ? locale === "es"
                ? "A la espera de confirmación"
                : "Awaiting patient confirmation"
              : locale === "es"
                ? "Todos los turnos confirmados"
                : "All appointments confirmed"}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es"
              ? "Distribución de sillones"
              : "Operatory Allocation"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {locale === "es"
              ? "Sillones 1 y 2 operativos"
              : "Chairs 1 & 2 operational"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Flujo continuo entre gabinetes"
              : "Continuous flow across operatories"}
          </p>
        </div>
      </div>

      {/* Up Next Patient Focus Module */}
      <section aria-labelledby="up-next-title" className="pt-8">
        {dashboard.upNext ? (
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-card/40 p-6 sm:p-7 shadow-xs ring-1 ring-black/[0.03] sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.dashboard.nextAppointment.badge}
                </span>
                <span className="inline-flex size-1.5 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {locale === "es"
                    ? "· Atención inmediata"
                    : "· Immediate care"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
                <time
                  className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl"
                  dateTime={dashboard.upNext.startsAt.toISOString()}
                >
                  {formatDemoTime(dashboard.upNext.startsAt, locale)}
                </time>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-semibold text-foreground/80">
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
                  {upNextTreatment?.name ?? dashboard.upNext.treatmentName}
                </Link>
                <span aria-hidden className="text-muted-foreground/40">
                  ·
                </span>
                <Badge
                  className="gap-1 text-xs font-medium text-muted-foreground"
                  variant="secondary"
                >
                  <MapPin
                    aria-hidden
                    className="size-3 text-muted-foreground"
                  />
                  {locale === "es"
                    ? `Sillón ${dashboard.upNext.operatory} · Asignado`
                    : `Operatory ${dashboard.upNext.operatory} · Assigned`}
                </Badge>
                <AppointmentStatus
                  locale={locale}
                  status={dashboard.upNext.status}
                />
              </div>
            </div>
            <div className="mt-6 flex shrink-0 flex-wrap items-center gap-2.5 sm:mt-0">
              {dashboard.upNext.status === "SCHEDULED" ? (
                <ConfirmAppointmentButton
                  appointmentId={dashboard.upNext.id}
                  patientName={dashboard.upNext.patientName}
                  size="sm"
                />
              ) : dashboard.upNext.status === "CONFIRMED" ? (
                <ArriveAppointmentButton
                  appointmentId={dashboard.upNext.id}
                  patientName={dashboard.upNext.patientName}
                  size="sm"
                />
              ) : null}
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-border/80 font-semibold shadow-xs"
              >
                <Link href={scheduleHref(dashboard.upNext)}>
                  {t.dashboard.nextAppointment.viewInSchedule}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-border/80 bg-card/40 p-8 text-center sm:text-left shadow-xs">
            <h2
              className="text-base font-semibold text-foreground"
              id="up-next-title"
            >
              {t.dashboard.nextAppointment.noneTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.nextAppointment.noneDesc}
            </p>
          </div>
        )}
      </section>

      {/* Main Operating Grid: Today's Agenda + Needs Attention */}
      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,.8fr)]">
        <section aria-labelledby="today-agenda-title">
          <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.dashboard.todayAgenda.badge}
              </p>
              <h2
                className="mt-2 text-xl font-semibold tracking-tight text-foreground"
                id="today-agenda-title"
                tabIndex={-1}
              >
                {t.dashboard.todayAgenda.heading}
              </h2>
            </div>
            <span className="rounded-full border border-border/70 bg-secondary/60 px-3 py-0.5 text-xs font-semibold text-muted-foreground">
              {t.dashboard.todayAgenda.count(dashboard.today.length)}
            </span>
          </div>

          {dashboard.today.length ? (
            <ol className="mt-4 divide-y divide-border/70 border-y border-border/80">
              {dashboard.today.map((appointment) => {
                const localizedTreatment = getLocalizedTreatment(
                  {
                    id: appointment.treatmentId,
                    name: appointment.treatmentName,
                  },
                  locale,
                );
                return (
                  <li
                    className="-mx-3 grid gap-3 rounded-[var(--radius-lg)] px-3 py-4 transition-all duration-150 hover:bg-secondary/40 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center"
                    key={appointment.id}
                  >
                    <time
                      className="font-mono text-sm font-semibold tabular-nums text-foreground"
                      dateTime={appointment.startsAt.toISOString()}
                    >
                      {formatDemoTime(appointment.startsAt, locale)}
                    </time>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-[10px] font-semibold text-foreground/80">
                          {getPatientInitials(appointment.patientName)}
                        </span>
                        <Link
                          className="truncate font-semibold text-foreground transition-colors hover:text-primary"
                          href={`/demo/patients/${appointment.patientId}`}
                        >
                          {appointment.patientName}
                        </Link>
                      </div>
                      <Link
                        className="mt-1 block truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                        href={`/demo/treatments?treatment=${appointment.treatmentId}`}
                      >
                        {localizedTreatment.name}
                      </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <AppointmentStatus
                        locale={locale}
                        status={appointment.status}
                      />
                      {appointment.status === "CONFIRMED" ? (
                        <ArriveAppointmentButton
                          appointmentId={appointment.id}
                          patientName={appointment.patientName}
                        />
                      ) : null}
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-xs font-medium hover:bg-secondary"
                      >
                        <Link
                          aria-label={
                            locale === "es"
                              ? `Ver turno de ${appointment.patientName} a las ${formatDemoTime(appointment.startsAt, locale)} en la agenda`
                              : `View appointment for ${appointment.patientName} at ${formatDemoTime(appointment.startsAt, locale)} in schedule`
                          }
                          href={scheduleHref(appointment)}
                        >
                          {t.dashboard.todayAgenda.viewInSchedule}
                        </Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-border/70 bg-card/30 py-12 text-center">
              <Clock3
                aria-hidden
                className="mx-auto size-5 text-muted-foreground"
              />
              <p className="mt-3 font-semibold text-foreground">
                {t.dashboard.todayAgenda.emptyTitle}
              </p>
              <Button
                asChild
                className="mt-4 font-semibold shadow-xs"
                variant="outline"
              >
                <Link href="/demo/schedule?create=1">
                  {t.dashboard.todayAgenda.emptyAction}
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Needs Attention Follow-up Queue */}
        {dashboard.needsAttention.length ? (
          <section
            aria-labelledby="attention-title"
            className="rounded-[var(--radius-xl)] border border-border/80 bg-card/40 p-5 sm:p-6 xl:self-start shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.dashboard.needsAttention.badge}
                </p>
                <h2
                  className="mt-1 text-lg font-semibold tracking-tight text-foreground"
                  id="attention-title"
                >
                  {t.dashboard.needsAttention.heading}
                </h2>
              </div>
              <span className="rounded-full border border-border/80 bg-secondary/80 px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground/80">
                {dashboard.needsAttention.length}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {t.dashboard.needsAttention.description}
            </p>
            <ol className="mt-4 divide-y divide-border/60">
              {dashboard.needsAttention.map((appointment) => {
                const localizedTreatment = getLocalizedTreatment(
                  {
                    id: appointment.treatmentId,
                    name: appointment.treatmentName,
                  },
                  locale,
                );
                return (
                  <li
                    className="-mx-2 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-secondary/40"
                    key={appointment.id}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <Link
                        className="truncate font-semibold text-sm text-foreground transition-colors hover:text-primary"
                        href={`/demo/patients/${appointment.patientId}`}
                      >
                        {appointment.patientName}
                      </Link>
                      <time
                        className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground font-medium"
                        dateTime={appointment.startsAt.toISOString()}
                      >
                        {formatDemoTime(appointment.startsAt, locale)}
                      </time>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {localizedTreatment.name}
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
                        className="text-xs font-medium"
                      >
                        <Link href={scheduleHref(appointment)}>
                          {t.dashboard.needsAttention.viewInSchedule}
                        </Link>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}
      </div>

      {/* Clinical Handover Notes Feed */}
      <section
        aria-labelledby="recent-notes-title"
        className="mt-14 border-t border-border/80 pt-10"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-accent">
                {t.dashboard.recentNotes.badge}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>{t.dashboard.recentNotes.sub}</span>
            </div>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-foreground"
              id="recent-notes-title"
            >
              {t.dashboard.recentNotes.heading}
            </h2>
          </div>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-xs font-medium hover:bg-secondary"
          >
            <Link href="/demo/notes">{t.dashboard.recentNotes.viewLedger}</Link>
          </Button>
        </div>

        {dashboard.recentNotes.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.recentNotes.map((note) => {
              const noteTreatment = note.treatmentId
                ? getLocalizedTreatment(
                    { id: note.treatmentId, name: note.treatmentName ?? "" },
                    locale,
                  )
                : null;
              return (
                <div
                  className="group flex flex-col justify-between rounded-[var(--radius-xl)] border border-border/80 bg-card/40 p-5 shadow-xs transition-all hover:border-foreground/20 hover:bg-card hover:shadow-sm"
                  key={note.id}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-xs font-semibold text-foreground/80">
                          {getPatientInitials(note.patientName)}
                        </span>
                        <Link
                          className="truncate font-semibold text-sm text-foreground transition-colors hover:text-primary"
                          href={`/demo/patients/${note.patientId}`}
                        >
                          {note.patientName}
                        </Link>
                      </div>
                      {noteTreatment ? (
                        <Link
                          className="inline-flex max-w-[120px] items-center rounded-full border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-foreground/80 truncate transition-colors hover:border-foreground/30 hover:text-foreground"
                          href={`/demo/treatments?treatment=${note.treatmentId}`}
                        >
                          <span className="truncate">{noteTreatment.name}</span>
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-foreground/90">
                      {getLocalizedPatientNote(note.id, note.body, locale)}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock
                        aria-hidden
                        className="size-3 text-muted-foreground/60"
                      />
                      {formatDemoDate(note.createdAt, locale)}
                    </span>
                    <span className="font-medium text-foreground/70">
                      {locale === "es" ? "Dra. Jane Smith" : "Dr. Jane Smith"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border/70 bg-card/30 py-12 text-center">
            <FileText
              aria-hidden
              className="mx-auto size-5 text-muted-foreground"
            />
            <p className="mt-3 font-semibold text-foreground">
              {t.dashboard.recentNotes.emptyTitle}
            </p>
          </div>
        )}
      </section>

      {/* Explore DMS Guide */}
      <ExploreDmsGuide />
    </main>
  );
}
