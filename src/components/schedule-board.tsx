"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { AppointmentSheet } from "@/components/appointment-sheet";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
} from "@/lib/demo/schedule";
import { getDemoClock } from "@/lib/demo/constants";
import type {
  ScheduleAppointment,
  SchedulePatient,
  ScheduleTreatment,
} from "@/lib/schedule-data";

type ScheduleBoardProps = {
  initialPatientId?: string;
  initialSheetOpen?: boolean;
  appointments: ScheduleAppointment[];
  patients: SchedulePatient[];
  treatments: ScheduleTreatment[];
  weekStart: string;
};

type SheetState =
  | { appointment: ScheduleAppointment; startsAt?: never }
  | { appointment?: never; patientId?: string; startsAt?: string };

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

function slotIndex(appointment: ScheduleAppointment) {
  const [hours, minutes] = practiceTimeInputValue(
    new Date(appointment.startsAt),
  )
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

export function ScheduleBoard({
  appointments,
  initialPatientId,
  initialSheetOpen,
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
  const [sheetState, setSheetState] = useState<SheetState | null>(
    initialSheetOpen ? { patientId: initialPatientId } : null,
  );
  const [announcement, setAnnouncement] = useState("");
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

  function openCreate(startsAt?: string) {
    setSheetState({ patientId: initialPatientId, startsAt });
  }

  function closeSheet() {
    setSheetState(null);
  }

  function handleSaved(message: string) {
    setAnnouncement(message);
    closeSheet();
    window.setTimeout(() => setAnnouncement(""), 4000);
    router.refresh();
  }

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-border pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Appointment coordination
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Schedule
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {weekRange(days)} · Monday–Friday
            </p>
          </div>
          <Button
            className="hidden md:inline-flex"
            onClick={() => openCreate()}
          >
            <CalendarPlus aria-hidden className="size-4" />
            Create appointment
          </Button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Schedule week" className="flex items-center gap-1">
            <Button
              asChild
              aria-label="Previous week"
              size="icon"
              variant="ghost"
            >
              <Link href={`/demo/schedule?week=${previousWeek}`}>
                <ChevronLeft aria-hidden className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/demo/schedule">Today</Link>
            </Button>
            <Button asChild aria-label="Next week" size="icon" variant="ghost">
              <Link href={`/demo/schedule?week=${nextWeek}`}>
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </nav>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Status</span>
            <Select
              className="w-auto px-2"
              onChange={(event) =>
                setFilter(event.target.value as StatusFilter)
              }
              value={filter}
            >
              <option value="ALL">All active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
            </Select>
          </label>
        </div>
      </header>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <section aria-label="Week schedule" className="mt-8 hidden md:block">
        <div
          aria-label="Scrollable week schedule"
          className="overflow-x-auto border border-border pb-2 focus-visible:outline-none"
          role="region"
          tabIndex={0}
        >
          <div className="min-w-[62rem]">
            <div className="relative z-10 grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))] border-b border-border bg-background">
              <div className="sticky left-0 z-20 border-r border-border bg-background px-3 py-4 font-mono text-xs text-muted-foreground">
                Time
              </div>
              {days.map((day) => (
                <div
                  className="border-r border-border px-4 py-4 text-sm font-medium last:border-r-0"
                  key={day.toISOString()}
                >
                  {dayLabel(day)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[4.5rem_repeat(5,minmax(10.5rem,1fr))]">
              <div className="sticky left-0 z-10 border-r border-border bg-background">
                {Array.from({ length: scheduleSlotsPerDay }, (_, index) => (
                  <div
                    className="h-12 border-b border-border bg-background px-3 pt-1 font-mono text-xs text-muted-foreground"
                    key={index}
                  >
                    {String(scheduleStartHour + Math.floor(index / 2)).padStart(
                      2,
                      "0",
                    )}
                    :{index % 2 ? "30" : "00"}
                  </div>
                ))}
              </div>
              {days.map((day) => {
                const dayKey = practiceDateInputValue(day);
                const dayAppointments = appointmentsByDay.get(dayKey) ?? [];
                const isDemoDay =
                  dayKey === practiceDateInputValue(getDemoClock());

                return (
                  <div
                    className="relative border-r border-border last:border-r-0"
                    key={dayKey}
                  >
                    {Array.from({ length: scheduleSlotsPerDay }, (_, index) => {
                      const startsAt = scheduleSlotStart(
                        day,
                        index,
                      ).toISOString();
                      const slotTime = formatDemoTime(new Date(startsAt));

                      return (
                        <button
                          aria-label={`Create appointment for ${dayLabel(day)} at ${slotTime}`}
                          className="block h-12 w-full border-b border-border text-left transition-colors hover:bg-secondary/70 focus-visible:relative focus-visible:z-20 focus-visible:outline-none"
                          key={startsAt}
                          onClick={() => openCreate(startsAt)}
                          type="button"
                        />
                      );
                    })}
                    {isDemoDay ? (
                      <div className="pointer-events-none absolute top-0 z-10 h-px w-full bg-primary">
                        <span className="absolute -top-2 left-1 rounded bg-primary px-1 font-mono text-[10px] text-primary-foreground">
                          now
                        </span>
                      </div>
                    ) : null}
                    {dayAppointments.map((appointment) => {
                      const index = slotIndex(appointment);
                      const height = (appointment.durationMinutes / 30) * 3;
                      const isCompact = appointment.durationMinutes <= 30;

                      return (
                        <button
                          aria-label={`Open ${appointment.status.toLowerCase()} appointment for ${appointmentName(appointment)} at ${formatDemoTime(new Date(appointment.startsAt))}`}
                          className={`absolute right-1 left-1 z-10 overflow-hidden rounded-md border bg-card text-left transition-colors hover:border-primary/35 hover:bg-accent/40 focus-visible:outline-none ${isCompact ? "px-1 py-1" : "px-2 py-1.5"}`}
                          key={appointment.id}
                          onClick={() => setSheetState({ appointment })}
                          style={{
                            height: `${height}rem`,
                            top: `${index * 3}rem`,
                          }}
                          type="button"
                        >
                          <span className="block truncate text-xs leading-3 font-semibold">
                            {formatDemoTime(new Date(appointment.startsAt))} ·{" "}
                            {appointment.patientName}
                          </span>
                          {isCompact ? (
                            <span
                              className={
                                appointment.status === "CONFIRMED"
                                  ? "mt-0.5 block truncate text-[10px] leading-3 font-medium text-primary"
                                  : "mt-0.5 block truncate text-[10px] leading-3 font-medium text-muted-foreground"
                              }
                            >
                              {appointmentStatusLabel(appointment)}
                            </span>
                          ) : (
                            <>
                              <span className="mt-0.5 block truncate text-xs leading-3 text-muted-foreground">
                                {appointment.treatmentName}
                              </span>
                              <span
                                className={
                                  appointment.status === "CONFIRMED"
                                    ? "mt-0.5 block text-[10px] leading-3 font-medium text-primary"
                                    : "mt-0.5 block text-[10px] leading-3 font-medium text-muted-foreground"
                                }
                              >
                                {appointmentStatusLabel(appointment)}
                              </span>
                            </>
                          )}
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
              (appointment) => slotIndex(appointment) === index,
            );

            return (
              <li
                className="flex min-h-16 items-center gap-4 py-2"
                key={startsAt.toISOString()}
              >
                <time className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                  {formatDemoTime(startsAt)}
                </time>
                {slotAppointments.length ? (
                  slotAppointments.map((appointment) => (
                    <button
                      aria-label={`Open ${appointment.status.toLowerCase()} appointment for ${appointmentName(appointment)} at ${formatDemoTime(new Date(appointment.startsAt))}`}
                      className="min-w-0 flex-1 rounded-md border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/35 hover:bg-accent/40 focus-visible:outline-none"
                      key={appointment.id}
                      onClick={() => setSheetState({ appointment })}
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
                    onClick={() => openCreate(startsAt.toISOString())}
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
            <Button className="mt-4" onClick={() => openCreate()}>
              <CalendarPlus aria-hidden className="size-4" />
              Create appointment
            </Button>
          )}
        </section>
      ) : null}

      {sheetState ? (
        <AppointmentSheet
          appointment={sheetState.appointment}
          initialPatientId={
            "patientId" in sheetState ? sheetState.patientId : undefined
          }
          initialStartsAt={
            "startsAt" in sheetState ? sheetState.startsAt : undefined
          }
          key={sheetState.appointment?.id ?? sheetState.startsAt ?? "new"}
          onOpenChange={(open) => {
            if (!open) closeSheet();
          }}
          onSaved={handleSaved}
          open
          patients={patients}
          treatments={treatments}
        />
      ) : null}
    </div>
  );
}
