"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ScheduleContextPanel,
  type ScheduleMutationResult,
} from "@/components/schedule-context-panel";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import {
  addPracticeDays,
  practiceDateInputValue,
  practiceTimeInputValue,
  scheduleSlotStart,
  scheduleSlotsPerDay,
  scheduleStartHour,
  scheduleWeekDays,
  scheduleWeekKey,
  scheduleWeekStart,
} from "@/lib/demo/schedule";
import { getDemoClock } from "@/lib/demo/constants";
import type {
  ScheduleAppointment,
  SchedulePatient,
  ScheduleTreatment,
} from "@/lib/schedule-data";

type ScheduleBoardProps = {
  appointments: ScheduleAppointment[];
  initialAppointmentId?: string;
  initialCreate?: boolean;
  initialPatientId?: string;
  initialTreatmentId?: string;
  patients: SchedulePatient[];
  treatments: ScheduleTreatment[];
  weekStart: string;
};

type ContextState =
  | { appointment: ScheduleAppointment; kind: "appointment" }
  | {
      durationMinutes: number;
      kind: "create";
      patientId?: string;
      startsAt?: string;
      treatmentId?: string;
    };

type StatusFilter = "ALL" | "CONFIRMED" | "SCHEDULED";

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
  }).format(date);
}

function weekRange(days: Date[]) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
  });

  return `${formatter.format(days[0])}–${formatter.format(days[4])}`;
}

function appointmentEnd(appointment: ScheduleAppointment) {
  return new Date(
    new Date(appointment.startsAt).getTime() +
      appointment.durationMinutes * 60 * 1000,
  );
}

function slotIndex(startsAt: string) {
  const [hours, minutes] = practiceTimeInputValue(new Date(startsAt))
    .split(":")
    .map(Number);
  return (hours - scheduleStartHour) * 2 + minutes / 30;
}

function appointmentName(appointment: ScheduleAppointment) {
  return `${appointment.patientName} · ${appointment.treatmentName}`;
}

function appointmentStatusLabel(appointment: ScheduleAppointment) {
  return appointment.status === "CONFIRMED" ? "Confirmed" : "Scheduled";
}

function initialContext({
  appointments,
  initialAppointmentId,
  initialCreate,
  initialPatientId,
  initialTreatmentId,
  treatments,
}: Pick<
  ScheduleBoardProps,
  | "appointments"
  | "initialAppointmentId"
  | "initialCreate"
  | "initialPatientId"
  | "initialTreatmentId"
  | "treatments"
>): ContextState | null {
  const appointment = appointments.find(
    (item) => item.id === initialAppointmentId,
  );

  if (appointment) {
    return { appointment, kind: "appointment" };
  }

  if (initialCreate) {
    const treatment = treatments.find((item) => item.id === initialTreatmentId);

    return {
      durationMinutes:
        treatment?.defaultDurationMinutes ??
        treatments[0]?.defaultDurationMinutes ??
        30,
      kind: "create",
      patientId: initialPatientId,
      treatmentId: treatment?.id,
    };
  }

  return null;
}

function useIntegratedContextPanel() {
  const [isIntegrated, setIsIntegrated] = useState(false);

  useEffect(() => {
    // Falls back to overlay if effective container is < 1480px (UI-SPEC line 862).
    const query = window.matchMedia("(min-width: 1600px)");
    const sync = () => setIsIntegrated(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return isIntegrated;
}

export function ScheduleBoard({
  appointments,
  initialAppointmentId,
  initialCreate = false,
  initialPatientId,
  initialTreatmentId,
  patients,
  treatments,
  weekStart,
}: ScheduleBoardProps) {
  const router = useRouter();
  const days = useMemo(
    () => scheduleWeekDays(new Date(weekStart)),
    [weekStart],
  );
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [mobileDayIndex, setMobileDayIndex] = useState(() => {
    const demoDate = practiceDateInputValue(getDemoClock());
    const index = days.findIndex(
      (day) => practiceDateInputValue(day) === demoDate,
    );
    return index >= 0 ? index : 0;
  });
  const [context, setContext] = useState<ContextState | null>(() =>
    initialContext({
      appointments,
      initialAppointmentId,
      initialCreate,
      initialPatientId,
      initialTreatmentId,
      treatments,
    }),
  );
  const returnFocusTarget = useRef<HTMLElement | null>(null);
  const isIntegrated = useIntegratedContextPanel();
  const filteredAppointments =
    filter === "ALL"
      ? appointments
      : appointments.filter((appointment) => appointment.status === filter);
  const appointmentsByDay = new Map<string, ScheduleAppointment[]>();

  for (const appointment of filteredAppointments) {
    const key = practiceDateInputValue(new Date(appointment.startsAt));
    const current = appointmentsByDay.get(key) ?? [];
    current.push(appointment);
    appointmentsByDay.set(key, current);
  }

  const previousWeek = scheduleWeekKey(addPracticeDays(days[0], -7));
  const nextWeek = scheduleWeekKey(addPracticeDays(days[0], 7));
  const selectedMobileDay = days[mobileDayIndex];
  const selectedMobileAppointments =
    appointmentsByDay.get(practiceDateInputValue(selectedMobileDay)) ?? [];
  const draft = context?.kind === "create" ? context : null;
  const selectedAppointmentId =
    context?.kind === "appointment" ? context.appointment.id : undefined;
  const demoDayKey = practiceDateInputValue(getDemoClock());
  const demoMarkerSlot = slotIndex(getDemoClock().toISOString());
  const hasVisibleDemoMarker =
    demoMarkerSlot >= 0 && demoMarkerSlot <= scheduleSlotsPerDay;

  function rememberFocusTarget(target?: HTMLElement) {
    returnFocusTarget.current =
      target ?? document.getElementById("schedule-title");
  }

  const writeContextHistory = useCallback(
    (nextContext: ContextState) => {
      const parameters = new URLSearchParams({
        week: scheduleWeekKey(days[0]),
      });

      if (nextContext.kind === "appointment") {
        parameters.set("appointment", nextContext.appointment.id);
      } else {
        parameters.set("create", "1");
        if (nextContext.patientId) {
          parameters.set("patient", nextContext.patientId);
        }
        if (nextContext.treatmentId) {
          parameters.set("treatment", nextContext.treatmentId);
        }
      }

      window.history.pushState(null, "", `/demo/schedule?${parameters}`);
    },
    [days],
  );

  const openCreate = useCallback(
    (startsAt?: string, trigger?: HTMLElement) => {
      rememberFocusTarget(trigger);
      const treatment = treatments.find(
        (item) => item.id === initialTreatmentId,
      );
      const nextContext: ContextState = {
        durationMinutes:
          treatment?.defaultDurationMinutes ??
          treatments[0]?.defaultDurationMinutes ??
          30,
        kind: "create",
        patientId: initialPatientId,
        startsAt,
        treatmentId: initialTreatmentId,
      };
      setContext(nextContext);
      writeContextHistory(nextContext);
    },
    [initialPatientId, initialTreatmentId, treatments, writeContextHistory],
  );

  function openAppointment(
    appointment: ScheduleAppointment,
    trigger: HTMLElement,
  ) {
    rememberFocusTarget(trigger);
    const nextContext: ContextState = { appointment, kind: "appointment" };
    setContext(nextContext);
    writeContextHistory(nextContext);
  }

  function restoreFocus() {
    window.requestAnimationFrame(() => {
      if (returnFocusTarget.current?.isConnected) {
        returnFocusTarget.current.focus();
        return;
      }

      document.getElementById("schedule-title")?.focus();
    });
  }

  const closeContext = useCallback(() => {
    setContext(null);
    router.replace(`/demo/schedule?week=${scheduleWeekKey(days[0])}`, {
      scroll: false,
    });
    restoreFocus();
  }, [days, router]);

  function handleSaved(result: ScheduleMutationResult) {
    const resultingWeek = scheduleWeekKey(
      scheduleWeekStart(new Date(result.startsAt)),
    );
    setContext(null);
    announceWorkspaceFeedback(result.message);
    router.replace(`/demo/schedule?week=${resultingWeek}`, { scroll: false });
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement
      ) {
        return;
      }

      if (event.key === "Escape" && context) {
        event.preventDefault();
        closeContext();
        return;
      }

      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        openCreate();
        return;
      }

      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        router.push("/demo/schedule");
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        if (window.innerWidth < 768) {
          setMobileDayIndex((index) => {
            const adjustment = event.key === "ArrowLeft" ? -1 : 1;
            return Math.min(Math.max(index + adjustment, 0), days.length - 1);
          });
          return;
        }

        router.push(
          `/demo/schedule?week=${event.key === "ArrowLeft" ? previousWeek : nextWeek}`,
        );
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [
    closeContext,
    context,
    days.length,
    nextWeek,
    openCreate,
    previousWeek,
    router,
  ]);

  function renderContext(presentation: "integrated" | "overlay") {
    if (!context) {
      return null;
    }

    return (
      <ScheduleContextPanel
        appointment={
          context.kind === "appointment" ? context.appointment : undefined
        }
        initialPatientId={
          context.kind === "create" ? context.patientId : undefined
        }
        initialTreatmentId={
          context.kind === "create" ? context.treatmentId : undefined
        }
        initialStartsAt={
          context.kind === "create" ? context.startsAt : undefined
        }
        key={
          context.kind === "appointment"
            ? context.appointment.id
            : `${context.startsAt ?? "new"}:${context.treatmentId ?? ""}`
        }
        onDurationChange={(durationMinutes) => {
          if (context.kind === "create" && Number.isFinite(durationMinutes)) {
            setContext({ ...context, durationMinutes });
          }
        }}
        onOpenChange={(open) => !open && closeContext()}
        onSaved={handleSaved}
        open
        patients={patients}
        presentation={presentation}
        treatments={treatments}
      />
    );
  }

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-border pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Appointment coordination
            </p>
            <h1
              className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
              id="schedule-title"
              tabIndex={-1}
            >
              Schedule
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {weekRange(days)} · Monday–Friday
            </p>
          </div>
          <Button
            className="hidden md:inline-flex"
            onClick={(event) => openCreate(undefined, event.currentTarget)}
          >
            <CalendarPlus aria-hidden className="size-4" />
            Create appointment
          </Button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Schedule week"
            className="inline-flex items-center rounded-[var(--radius-md)] border border-border bg-surface p-0.5 shadow-xs"
          >
            <Button
              asChild
              aria-label="Previous week"
              className="size-8 rounded-[var(--radius-sm)]"
              size="icon"
              variant="ghost"
            >
              <Link href={`/demo/schedule?week=${previousWeek}`}>
                <ChevronLeft aria-hidden className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-8 rounded-[var(--radius-sm)] px-3 text-xs font-medium"
              size="sm"
              variant="ghost"
            >
              <Link href="/demo/schedule">Today</Link>
            </Button>
            <Button
              asChild
              aria-label="Next week"
              className="size-8 rounded-[var(--radius-sm)]"
              size="icon"
              variant="ghost"
            >
              <Link href={`/demo/schedule?week=${nextWeek}`}>
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </nav>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Status</span>
            <Select
              onValueChange={(val) => setFilter(val as StatusFilter)}
              value={filter}
            >
              <SelectTrigger className="h-[var(--control-sm)] min-w-[7.5rem] bg-card px-2.5 text-xs font-medium">
                <SelectValue placeholder="All active" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="ALL">All active</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mt-8",
          context &&
            isIntegrated &&
            "grid grid-cols-[minmax(0,1fr)_22rem] gap-5",
        )}
      >
        <section aria-label="Week schedule" className="hidden md:block">
          <div
            aria-label="Scrollable week schedule"
            className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-surface pb-2 shadow-xs focus-visible:outline-none"
            role="region"
            tabIndex={0}
          >
            <div className="min-w-[62rem]">
              <div className="sticky top-0 z-20 grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))] border-b border-border bg-surface">
                <div className="sticky left-0 z-30 border-r border-border bg-surface px-3 py-4 font-mono text-xs text-muted-foreground">
                  Time
                </div>
                {days.map((day) => {
                  const isDemoDay = practiceDateInputValue(day) === demoDayKey;
                  return (
                    <div
                      className={cn(
                        "border-r border-border px-4 py-4 text-sm font-semibold last:border-r-0",
                        isDemoDay && "border-b-2 border-b-accent",
                      )}
                      key={day.toISOString()}
                    >
                      {dayLabel(day)}
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))]">
                <div className="sticky left-0 z-10 border-r border-border bg-surface">
                  {Array.from({ length: scheduleSlotsPerDay }, (_, index) => (
                    <div
                      className="h-12 border-b border-border-subtle bg-surface px-3 pt-1 font-mono text-xs text-muted-foreground"
                      key={index}
                    >
                      {String(
                        scheduleStartHour + Math.floor(index / 2),
                      ).padStart(2, "0")}
                      :{index % 2 ? "30" : "00"}
                    </div>
                  ))}
                </div>
                {days.map((day) => {
                  const dayKey = practiceDateInputValue(day);
                  const dayAppointments = appointmentsByDay.get(dayKey) ?? [];
                  const isDemoDay = dayKey === demoDayKey;

                  return (
                    <div
                      className="relative border-r border-border last:border-r-0"
                      key={dayKey}
                    >
                      {Array.from(
                        { length: scheduleSlotsPerDay },
                        (_, index) => {
                          const startsAt = scheduleSlotStart(
                            day,
                            index,
                          ).toISOString();
                          return (
                            <button
                              aria-label={`Create appointment for ${dayLabel(day)} at ${formatDemoTime(new Date(startsAt))}`}
                              className="dms-pressable block h-12 w-full border-b border-border-subtle text-left transition-colors hover:bg-accent/[0.06] focus-visible:relative focus-visible:z-20 focus-visible:outline-none"
                              key={startsAt}
                              onClick={(event) =>
                                openCreate(startsAt, event.currentTarget)
                              }
                              type="button"
                            />
                          );
                        },
                      )}
                      {isDemoDay && hasVisibleDemoMarker ? (
                        <div
                          className="pointer-events-none absolute z-20 h-px w-full bg-accent"
                          style={{ top: `${demoMarkerSlot * 3}rem` }}
                        >
                          <span className="absolute -top-2 left-1 rounded-[var(--radius-sm)] bg-accent px-1 font-mono text-[10px] text-accent-foreground">
                            Now
                          </span>
                        </div>
                      ) : null}
                      {draft &&
                      draft.startsAt &&
                      practiceDateInputValue(new Date(draft.startsAt)) ===
                        dayKey ? (
                        <div
                          aria-label={`Draft appointment at ${formatDemoTime(new Date(draft.startsAt))} for ${draft.durationMinutes} minutes`}
                          className="pointer-events-none absolute right-1 left-1 z-10 overflow-hidden rounded-[var(--radius-sm)] border border-dashed border-accent bg-accent-soft/40 px-2 py-1.5 text-left transition-[height] duration-[var(--motion-base)] ease-[var(--ease-emphasized)]"
                          role="status"
                          style={{
                            height: `${(draft.durationMinutes / 30) * 3}rem`,
                            top: `${slotIndex(draft.startsAt) * 3}rem`,
                          }}
                        >
                          <span className="block truncate text-xs font-semibold text-accent-soft-foreground">
                            Draft appointment
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] text-accent-soft-foreground">
                            {draft.durationMinutes} min
                          </span>
                        </div>
                      ) : null}
                      {dayAppointments.map((appointment) => {
                        const isCompact = appointment.durationMinutes <= 30;
                        const isSelected =
                          appointment.id === selectedAppointmentId;
                        const confirmed = appointment.status === "CONFIRMED";

                        return (
                          <button
                            aria-label={`Open ${appointment.status.toLowerCase()} appointment for ${appointmentName(appointment)} at ${formatDemoTime(new Date(appointment.startsAt))}`}
                            aria-pressed={isSelected}
                            className={cn(
                              "dms-pressable dms-raised-action absolute right-1 left-1 z-10 overflow-hidden rounded-[var(--radius-sm)] border text-left focus-visible:outline-none",
                              confirmed
                                ? "border-accent/30 bg-accent-soft text-accent-soft-foreground hover:border-accent"
                                : "border-border bg-surface hover:border-border-strong",
                              isSelected && "ring-2 ring-accent ring-offset-1",
                              isCompact ? "px-1 py-1" : "px-2 py-1.5",
                            )}
                            key={appointment.id}
                            onClick={(event) =>
                              openAppointment(appointment, event.currentTarget)
                            }
                            style={{
                              height: `${(appointment.durationMinutes / 30) * 3}rem`,
                              top: `${slotIndex(appointment.startsAt) * 3}rem`,
                            }}
                            type="button"
                          >
                            <span className="block truncate text-xs leading-3 font-semibold">
                              {formatDemoTime(new Date(appointment.startsAt))} ·{" "}
                              {appointment.patientName}
                            </span>
                            {!isCompact ? (
                              <span className="mt-0.5 block truncate text-xs leading-3 text-muted-foreground">
                                {appointment.treatmentName}
                              </span>
                            ) : null}
                            <span className="mt-0.5 block truncate text-[10px] leading-3 font-medium">
                              {appointmentStatusLabel(appointment)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        {context && isIntegrated ? renderContext("integrated") : null}
      </div>

      <section aria-label="Day agenda" className="mt-8 md:hidden">
        <div className="flex items-center justify-between gap-3 border-y border-border py-3">
          <Button
            aria-label="Previous day"
            disabled={mobileDayIndex === 0}
            onClick={() => setMobileDayIndex((index) => index - 1)}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </Button>
          <p aria-live="polite" className="text-sm font-medium">
            {formatDemoDate(selectedMobileDay)}
          </p>
          <Button
            aria-label="Next day"
            disabled={mobileDayIndex === days.length - 1}
            onClick={() => setMobileDayIndex((index) => index + 1)}
            size="icon"
            variant="ghost"
          >
            <ChevronRight aria-hidden className="size-4" />
          </Button>
        </div>
        <ol className="divide-y divide-border border-b border-border">
          {Array.from({ length: scheduleSlotsPerDay }, (_, index) => {
            const startsAt = scheduleSlotStart(selectedMobileDay, index);
            const slotAppointments = selectedMobileAppointments.filter(
              (appointment) => slotIndex(appointment.startsAt) === index,
            );
            const isDraft = draft?.startsAt === startsAt.toISOString();
            return (
              <li
                className="flex min-h-16 items-center gap-4 py-2"
                key={startsAt.toISOString()}
              >
                <time className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                  {formatDemoTime(startsAt)}
                </time>
                {isDraft ? (
                  <div
                    aria-live="polite"
                    className="flex-1 rounded-[var(--radius-sm)] border border-dashed border-accent bg-accent-soft/40 px-3 py-2 text-sm text-accent-soft-foreground"
                    role="status"
                  >
                    Draft appointment · {draft.durationMinutes} min
                  </div>
                ) : slotAppointments.length ? (
                  slotAppointments.map((appointment) => (
                    <button
                      aria-label={`Open ${appointment.status.toLowerCase()} appointment for ${appointmentName(appointment)} at ${formatDemoTime(new Date(appointment.startsAt))}`}
                      aria-pressed={appointment.id === selectedAppointmentId}
                      className={cn(
                        "dms-pressable dms-raised-action min-w-0 flex-1 rounded-[var(--radius-sm)] border px-3 py-2 text-left focus-visible:outline-none",
                        appointment.status === "CONFIRMED"
                          ? "border-accent/30 bg-accent-soft"
                          : "border-border bg-surface",
                        appointment.id === selectedAppointmentId &&
                          "ring-2 ring-accent ring-offset-1",
                      )}
                      key={appointment.id}
                      onClick={(event) =>
                        openAppointment(appointment, event.currentTarget)
                      }
                      type="button"
                    >
                      <p className="truncate text-sm font-medium">
                        {appointment.patientName}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {appointment.treatmentName} ·{" "}
                        {formatDemoTime(appointmentEnd(appointment))}
                      </p>
                      <div className="mt-2">
                        <AppointmentStatusBadge status={appointment.status} />
                      </div>
                    </button>
                  ))
                ) : (
                  <Button
                    className="justify-start text-muted-foreground"
                    onClick={(event) =>
                      openCreate(startsAt.toISOString(), event.currentTarget)
                    }
                    variant="ghost"
                  >
                    <CalendarPlus aria-hidden className="size-4" />
                    Create appointment
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {!filteredAppointments.length ? (
        <section className="mt-8 border-y border-border py-12 text-center">
          <Clock3
            aria-hidden
            className="mx-auto size-5 text-muted-foreground"
          />
          <p className="mt-3 font-medium">
            No appointments match this week and filter.
          </p>
          {filter !== "ALL" ? (
            <Button
              className="mt-4"
              onClick={() => setFilter("ALL")}
              variant="outline"
            >
              Clear filter
            </Button>
          ) : (
            <Button
              className="mt-4"
              onClick={(event) => openCreate(undefined, event.currentTarget)}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Create appointment
            </Button>
          )}
        </section>
      ) : null}

      {context && !isIntegrated ? renderContext("overlay") : null}
    </div>
  );
}
