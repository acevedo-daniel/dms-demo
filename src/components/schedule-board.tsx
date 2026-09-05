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
  initialOperatory?: "ALL" | "1" | "2";
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
      operatory?: number;
    };

type StatusFilter = "ALL" | "CONFIRMED" | "SCHEDULED" | "ARRIVED";
type OperatoryFilter = "ALL" | "1" | "2";

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
  if (appointment.status === "ARRIVED") return "Arrived";
  return appointment.status === "CONFIRMED" ? "Confirmed" : "Scheduled";
}

function initialContext({
  appointments,
  initialAppointmentId,
  initialCreate,
  initialPatientId,
  initialOperatory,
  initialTreatmentId,
  treatments,
}: Pick<
  ScheduleBoardProps,
  | "appointments"
  | "initialAppointmentId"
  | "initialCreate"
  | "initialPatientId"
  | "initialOperatory"
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
      operatory:
        initialOperatory && initialOperatory !== "ALL"
          ? Number(initialOperatory)
          : undefined,
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
  initialOperatory,
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
  const [operatoryFilter, setOperatoryFilter] = useState<OperatoryFilter>(
    initialOperatory ?? "ALL",
  );
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
      initialOperatory,
      initialTreatmentId,
      treatments,
    }),
  );
  const returnFocusTarget = useRef<HTMLElement | null>(null);
  const isIntegrated = useIntegratedContextPanel();
  const filteredAppointments = appointments.filter(
    (appointment) =>
      (filter === "ALL" || appointment.status === filter) &&
      (operatoryFilter === "ALL" ||
        String(appointment.operatory) === operatoryFilter),
  );
  const appointmentsByDay = new Map<string, ScheduleAppointment[]>();

  for (const appointment of filteredAppointments) {
    const key = practiceDateInputValue(new Date(appointment.startsAt));
    const current = appointmentsByDay.get(key) ?? [];
    current.push(appointment);
    appointmentsByDay.set(key, current);
  }

  const previousWeek = scheduleWeekKey(addPracticeDays(days[0], -7));
  const nextWeek = scheduleWeekKey(addPracticeDays(days[0], 7));
  const operatoryQuery =
    operatoryFilter === "ALL" ? "" : `&operatory=${operatoryFilter}`;
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
        if (nextContext.operatory) {
          parameters.set("operatory", String(nextContext.operatory));
        }
      }
      if (operatoryFilter !== "ALL") {
        parameters.set("operatory", operatoryFilter);
      }

      window.history.pushState(null, "", `/demo/schedule?${parameters}`);
    },
    [days, operatoryFilter],
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
        operatory:
          initialOperatory && initialOperatory !== "ALL"
            ? Number(initialOperatory)
            : undefined,
      };
      setContext(nextContext);
      writeContextHistory(nextContext);
    },
    [
      initialOperatory,
      initialPatientId,
      initialTreatmentId,
      treatments,
      writeContextHistory,
    ],
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
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-accent">
                Appointment Coordination
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>Atelier Dental</span>
            </div>
            <h1
              className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground"
              id="schedule-title"
              tabIndex={-1}
            >
              Schedule
            </h1>
            <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-medium text-foreground">
                {weekRange(days)}
              </span>
              <span aria-hidden className="text-muted-foreground/40">
                ·
              </span>
              <span>Monday–Friday clinical hours</span>
            </p>
          </div>
          <Button
            className="hidden md:inline-flex h-10 px-4 font-semibold shadow-xs"
            onClick={(event) => openCreate(undefined, event.currentTarget)}
          >
            <CalendarPlus aria-hidden className="size-4" />
            Create appointment
          </Button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Schedule week"
            className="inline-flex items-center rounded-full border border-border/80 bg-surface p-1 shadow-xs backdrop-blur-xs"
          >
            <Button
              asChild
              aria-label="Previous week"
              className="size-8 rounded-full hover:bg-secondary"
              size="icon"
              variant="ghost"
            >
              <Link
                href={`/demo/schedule?week=${previousWeek}${operatoryQuery}`}
              >
                <ChevronLeft aria-hidden className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-8 rounded-full px-3.5 text-xs font-semibold hover:bg-secondary"
              size="sm"
              variant="ghost"
            >
              <Link
                href={`/demo/schedule${operatoryFilter === "ALL" ? "" : `?operatory=${operatoryFilter}`}`}
              >
                Today
              </Link>
            </Button>
            <Button
              asChild
              aria-label="Next week"
              className="size-8 rounded-full hover:bg-secondary"
              size="icon"
              variant="ghost"
            >
              <Link href={`/demo/schedule?week=${nextWeek}${operatoryQuery}`}>
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </nav>
          <div className="flex max-w-full flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter
            </span>
            <div
              aria-label="Filter by appointment status"
              className="inline-flex items-center rounded-full border border-border/80 bg-surface p-1 shadow-xs backdrop-blur-xs"
              role="radiogroup"
            >
              {(
                [
                  { label: "All active", value: "ALL" },
                  { label: "Confirmed", value: "CONFIRMED" },
                  { label: "Arrived", value: "ARRIVED" },
                  { label: "Scheduled", value: "SCHEDULED" },
                ] as const
              ).map((tab) => (
                <button
                  aria-checked={filter === tab.value}
                  className={cn(
                    "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all",
                    filter === tab.value
                      ? "bg-secondary text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  role="radio"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              aria-label="Filter by operatory"
              className="inline-flex items-center rounded-full border border-border/80 bg-surface p-1 shadow-xs"
              role="radiogroup"
            >
              {(["ALL", "1", "2"] as const).map((value) => (
                <button
                  aria-checked={operatoryFilter === value}
                  className={cn(
                    "dms-pressable rounded-full px-3 py-1 text-xs font-medium",
                    operatoryFilter === value
                      ? "bg-secondary font-semibold text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={value}
                  onClick={() => setOperatoryFilter(value)}
                  role="radio"
                  type="button"
                >
                  {value === "ALL" ? "All chairs" : `Operatory ${value}`}
                </button>
              ))}
            </div>
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
            className="overflow-x-auto rounded-[var(--radius-lg)] border border-border/80 bg-surface pb-2 shadow-xs focus-visible:outline-none"
            role="region"
            tabIndex={0}
          >
            <div className="min-w-[62rem]">
              <div className="sticky top-0 z-20 grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))] border-b border-border/80 bg-surface/95 backdrop-blur-sm">
                <div className="sticky left-0 z-30 border-r border-border/80 bg-surface/95 px-3 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Time
                </div>
                {days.map((day) => {
                  const dayKey = practiceDateInputValue(day);
                  const isDemoDay = dayKey === demoDayKey;
                  const dayApptCount = (appointmentsByDay.get(dayKey) ?? [])
                    .length;
                  return (
                    <div
                      className={cn(
                        "border-r border-border/80 px-4 py-3.5 text-sm transition-colors last:border-r-0",
                        isDemoDay &&
                          "bg-primary/[0.03] border-b-2 border-b-primary",
                      )}
                      key={day.toISOString()}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "font-semibold tracking-tight",
                            isDemoDay ? "text-primary" : "text-foreground",
                          )}
                        >
                          {dayLabel(day)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {dayApptCount > 0 ? (
                            <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                              {dayApptCount}{" "}
                              {dayApptCount === 1 ? "slot" : "slots"}
                            </span>
                          ) : null}
                          {isDemoDay ? (
                            <span className="rounded-full border border-border/80 bg-foreground/5 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-foreground/80">
                              Today
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))]">
                <div className="sticky left-0 z-10 border-r border-border/80 bg-surface/95 backdrop-blur-xs">
                  {Array.from({ length: scheduleSlotsPerDay }, (_, index) => (
                    <div
                      className={cn(
                        "h-12 border-b border-border/50 bg-surface px-3 pt-1.5 font-mono text-xs text-muted-foreground/80",
                        index % 2 === 0
                          ? "border-b-border/70"
                          : "border-b-border/30",
                      )}
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
                      className={cn(
                        "relative border-r border-border/80 last:border-r-0",
                        isDemoDay && "bg-primary/[0.015]",
                      )}
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
                              className={cn(
                                "group/slot dms-pressable relative block h-12 w-full text-left transition-colors hover:bg-primary/[0.04] focus-visible:relative focus-visible:z-20 focus-visible:outline-none",
                                index % 2 === 0
                                  ? "border-b border-border/60"
                                  : "border-b border-border/30",
                              )}
                              key={startsAt}
                              onClick={(event) =>
                                openCreate(startsAt, event.currentTarget)
                              }
                              type="button"
                            >
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover/slot:opacity-100">
                                <span className="rounded-full border border-border/80 bg-surface px-2 py-0.5 font-mono text-[10px] font-medium text-foreground/80 shadow-2xs">
                                  + Book
                                </span>
                              </span>
                            </button>
                          );
                        },
                      )}
                      {isDemoDay && hasVisibleDemoMarker ? (
                        <div
                          className="pointer-events-none absolute z-20 h-px w-full bg-foreground/30"
                          style={{ top: `${demoMarkerSlot * 3}rem` }}
                        >
                          <span className="absolute -top-2.5 left-1.5 rounded-full border border-border bg-foreground px-2 py-0.5 text-[10px] font-medium tracking-wide text-background shadow-xs">
                            Now 08:30
                          </span>
                        </div>
                      ) : null}
                      {draft &&
                      draft.startsAt &&
                      practiceDateInputValue(new Date(draft.startsAt)) ===
                        dayKey ? (
                        <div
                          aria-label={`Draft appointment at ${formatDemoTime(new Date(draft.startsAt))} for ${draft.durationMinutes} minutes`}
                          className="pointer-events-none absolute right-1.5 left-1.5 z-10 overflow-hidden rounded-[var(--radius-md)] border-2 border-dashed border-accent/60 bg-accent-soft/40 px-2.5 py-2 text-left shadow-xs transition-[height] duration-[var(--motion-base)] ease-[var(--ease-emphasized)] backdrop-blur-xs"
                          role="status"
                          style={{
                            height: `${(draft.durationMinutes / 30) * 3}rem`,
                            top: `${slotIndex(draft.startsAt) * 3}rem`,
                          }}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="block truncate text-xs font-semibold text-foreground/90">
                              Draft appointment
                            </span>
                            <span className="rounded border border-border/70 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
                              {draft.durationMinutes} min
                            </span>
                          </div>
                        </div>
                      ) : null}
                      {dayAppointments.map((appointment) => {
                        const isCompact = appointment.durationMinutes <= 30;
                        const isSelected =
                          appointment.id === selectedAppointmentId;
                        const isConfirmed = appointment.status === "CONFIRMED";
                        const isArrived = appointment.status === "ARRIVED";

                        return (
                          <button
                            aria-label={`Open ${appointment.status.toLowerCase()} appointment for ${appointmentName(appointment)} at ${formatDemoTime(new Date(appointment.startsAt))}`}
                            aria-pressed={isSelected}
                            className={cn(
                              "dms-pressable dms-raised-action group absolute right-1.5 left-1.5 z-10 overflow-hidden rounded-[var(--radius-md)] border text-left transition-all duration-150 focus-visible:outline-none shadow-xs hover:shadow-sm",
                              isArrived
                                ? "border-border/90 border-l-[3.5px] border-l-info bg-card dark:bg-surface-raised/70 dark:hover:bg-surface-raised text-foreground hover:border-foreground/30"
                                : isConfirmed
                                  ? "border-border/90 border-l-[3.5px] border-l-accent bg-card dark:bg-surface-raised/70 dark:hover:bg-surface-raised text-foreground hover:border-foreground/30"
                                  : "border-border/90 border-l-[3.5px] border-l-foreground/30 bg-card dark:bg-surface-raised/70 dark:hover:bg-surface-raised text-foreground hover:border-foreground/30",
                              isSelected &&
                                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                              isCompact ? "px-2 py-1" : "px-2.5 py-1.5",
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
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold tabular-nums tracking-tight">
                                {formatDemoTime(new Date(appointment.startsAt))}
                              </span>
                              <span className="rounded border border-border/60 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                                {appointment.durationMinutes}m
                              </span>
                            </div>
                            <span className="mt-0.5 block truncate text-xs font-semibold leading-tight text-foreground">
                              {appointment.patientName}
                            </span>
                            <div className="mt-0.5 flex items-center justify-between gap-1">
                              {!isCompact ? (
                                <span className="block truncate text-[11px] text-muted-foreground leading-tight">
                                  {appointment.treatmentName}
                                </span>
                              ) : (
                                <span />
                              )}
                              <span
                                className={cn(
                                  "flex items-center gap-1 text-[10px] font-medium tracking-wide shrink-0",
                                  isArrived
                                    ? "text-info font-semibold"
                                    : isConfirmed
                                      ? "text-accent font-semibold"
                                      : "text-muted-foreground",
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "size-1 rounded-full",
                                    isArrived
                                      ? "bg-info"
                                      : isConfirmed
                                        ? "bg-accent"
                                        : "bg-muted-foreground/60",
                                  )}
                                />
                                <span>
                                  {appointmentStatusLabel(appointment)}
                                </span>
                              </span>
                            </div>
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
        <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card p-3 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <Button
              aria-label="Previous day"
              className="size-8 rounded-full"
              disabled={mobileDayIndex === 0}
              onClick={() => setMobileDayIndex((index) => index - 1)}
              size="icon"
              variant="ghost"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </Button>
            <p
              aria-live="polite"
              className="text-sm font-semibold text-foreground"
            >
              {formatDemoDate(selectedMobileDay)}
            </p>
            <Button
              aria-label="Next day"
              className="size-8 rounded-full"
              disabled={mobileDayIndex === days.length - 1}
              onClick={() => setMobileDayIndex((index) => index + 1)}
              size="icon"
              variant="ghost"
            >
              <ChevronRight aria-hidden className="size-4" />
            </Button>
          </div>

          <div className="mt-2.5 grid grid-cols-5 gap-1.5">
            {days.map((day, idx) => {
              const isSelected = idx === mobileDayIndex;
              const isDemoDay = practiceDateInputValue(day) === demoDayKey;
              const shortName = ["Mon", "Tue", "Wed", "Thu", "Fri"][idx];
              const dateNum = day.getDate();
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setMobileDayIndex(idx)}
                  className={cn(
                    "flex flex-col items-center py-2 rounded-[var(--radius-md)] border text-xs transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "border-transparent bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground",
                    !isSelected &&
                      isDemoDay &&
                      "border-border/80 text-foreground font-medium",
                  )}
                  type="button"
                >
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    {shortName}
                  </span>
                  <span className="text-sm font-semibold mt-0.5">
                    {dateNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ol className="mt-4 divide-y divide-border/60 border-y border-border/80">
          {Array.from({ length: scheduleSlotsPerDay }, (_, index) => {
            const startsAt = scheduleSlotStart(selectedMobileDay, index);
            const slotAppointments = selectedMobileAppointments.filter(
              (appointment) => slotIndex(appointment.startsAt) === index,
            );
            const isDraft = draft?.startsAt === startsAt.toISOString();
            return (
              <li
                className="flex min-h-16 items-center gap-4 py-2.5"
                key={startsAt.toISOString()}
              >
                <time className="w-12 shrink-0 font-mono text-xs font-medium text-muted-foreground">
                  {formatDemoTime(startsAt)}
                </time>
                {isDraft ? (
                  <div
                    aria-live="polite"
                    className="flex-1 rounded-[var(--radius-md)] border-2 border-dashed border-accent/60 bg-accent-soft/40 px-3 py-2 text-sm text-foreground/90"
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
                        "dms-pressable dms-raised-action min-w-0 flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-left focus-visible:outline-none shadow-xs",
                        appointment.status === "ARRIVED"
                          ? "border-border/90 border-l-4 border-l-info bg-card dark:bg-surface-raised/70"
                          : appointment.status === "CONFIRMED"
                            ? "border-border/90 border-l-4 border-l-accent bg-card dark:bg-surface-raised/70"
                            : "border-border/90 border-l-4 border-l-foreground/30 bg-card dark:bg-surface-raised/70",
                        appointment.id === selectedAppointmentId &&
                          "ring-2 ring-primary ring-offset-1",
                      )}
                      key={appointment.id}
                      onClick={(event) =>
                        openAppointment(appointment, event.currentTarget)
                      }
                      type="button"
                    >
                      <p className="truncate text-sm font-semibold text-foreground">
                        {appointment.patientName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
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
                    className="justify-start text-muted-foreground text-xs hover:text-foreground"
                    onClick={(event) =>
                      openCreate(startsAt.toISOString(), event.currentTarget)
                    }
                    size="sm"
                    variant="ghost"
                  >
                    <CalendarPlus aria-hidden className="size-3.5" />
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
