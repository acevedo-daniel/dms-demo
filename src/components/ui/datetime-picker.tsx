"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock as ClockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Practice time slots for Atelier Dental (30-minute intervals from 09:00 to 17:30)
const MORNING_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
];

const AFTERNOON_SLOTS = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export interface StudioDatePickerProps {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string; // YYYY-MM-DD
}

export function StudioDatePicker({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  disabled,
  id,
  name,
  onChange,
  required,
  value,
}: StudioDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Parse initial year/month from value (or fallback to May 2026 demo baseline)
  const initialDate = React.useMemo(() => {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return {
        day: Number(match[3]),
        month: Number(match[2]) - 1,
        year: Number(match[1]),
      };
    }
    return { day: 12, month: 4, year: 2026 }; // May 12, 2026
  }, [value]);

  const [navDate, setNavDate] = React.useState<{
    month: number;
    year: number;
  } | null>(null);

  const viewYear = navDate?.year ?? initialDate.year;
  const viewMonth = navDate?.month ?? initialDate.month;

  // Click outside and Escape handling
  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Compute month days
  const calendarData = React.useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // 0 = Monday, 6 = Sunday
    const startDayIndex = (firstDay.getDay() + 6) % 7;

    const days: Array<{
      dateString: string;
      dayNumber: number;
      isClinicalDay: boolean;
      isCurrentMonth: boolean;
      isSelected: boolean;
    }> = [];

    // Blank padding before first day
    for (let i = 0; i < startDayIndex; i++) {
      days.push({
        dateString: "",
        dayNumber: 0,
        isClinicalDay: false,
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = (startDayIndex + d - 1) % 7;
      const isClinicalDay = dayOfWeek < 5; // Monday - Friday
      const formattedMonth = String(viewMonth + 1).padStart(2, "0");
      const formattedDay = String(d).padStart(2, "0");
      const dateString = `${viewYear}-${formattedMonth}-${formattedDay}`;
      const isSelected = dateString === value;

      days.push({
        dateString,
        dayNumber: d,
        isClinicalDay,
        isCurrentMonth: true,
        isSelected,
      });
    }

    return days;
  }, [viewYear, viewMonth, value]);

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    if (viewMonth === 0) {
      setNavDate({ month: 11, year: viewYear - 1 });
    } else {
      setNavDate({ month: viewMonth - 1, year: viewYear });
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    if (viewMonth === 11) {
      setNavDate({ month: 0, year: viewYear + 1 });
    } else {
      setNavDate({ month: viewMonth + 1, year: viewYear });
    }
  };

  const selectDate = (dateStr: string) => {
    onChange(dateStr);
    setNavDate(null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            "dms-field flex h-[var(--control-md)] w-full rounded-[var(--radius-sm)] border border-border bg-card px-3 pr-10 font-mono text-sm tracking-wide text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
            ariaInvalid &&
              "border-destructive/80 ring-2 ring-destructive/15 bg-destructive/[0.02] focus:border-destructive focus:ring-destructive/25",
            className,
          )}
          disabled={disabled}
          id={id}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder="YYYY-MM-DD"
          required={required}
          type="text"
          value={value}
        />
        <button
          aria-hidden="true"
          className="absolute right-2.5 flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
          tabIndex={-1}
          type="button"
        >
          <CalendarIcon className="size-4" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1.5 w-72 rounded-[var(--radius-lg)] border border-border/90 bg-popover/98 p-3.5 shadow-raised backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150"
          role="dialog"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <span className="font-mono text-xs font-bold text-foreground">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous month"
                className="dms-pressable flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={prevMonth}
                type="button"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                aria-label="Next month"
                className="dms-pressable flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={nextMonth}
                type="button"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Row */}
          <div className="mt-2 grid grid-cols-7 text-center">
            {WEEKDAY_SHORT.map((day, idx) => (
              <span
                className={cn(
                  "py-1 font-mono text-[10px] font-semibold",
                  idx >= 5
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground",
                )}
                key={day}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {calendarData.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return <div className="size-8" key={`empty-${idx}`} />;
              }

              if (!item.isClinicalDay) {
                return (
                  <div
                    className="flex size-8 items-center justify-center font-mono text-xs text-muted-foreground/30 cursor-not-allowed"
                    key={item.dateString}
                    title="Practice closed on weekends"
                  >
                    {item.dayNumber}
                  </div>
                );
              }

              return (
                <button
                  className={cn(
                    "dms-pressable flex size-8 items-center justify-center rounded-full font-mono text-xs transition-all",
                    item.isSelected
                      ? "border border-primary/20 bg-primary font-bold text-primary-foreground shadow-xs"
                      : "text-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  key={item.dateString}
                  onClick={() => selectDate(item.dateString)}
                  type="button"
                >
                  {item.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Practice Quick Date Shortcuts */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              Shortcuts:
            </span>
            <div className="flex gap-1">
              <button
                className="rounded px-2 py-0.5 font-mono text-[10px] font-medium text-foreground bg-secondary/60 hover:bg-secondary transition-colors"
                onClick={() => selectDate("2026-05-12")}
                type="button"
              >
                Today
              </button>
              <button
                className="rounded px-2 py-0.5 font-mono text-[10px] font-medium text-foreground bg-secondary/60 hover:bg-secondary transition-colors"
                onClick={() => selectDate("2026-05-13")}
                type="button"
              >
                Tomorrow
              </button>
              <button
                className="rounded px-2 py-0.5 font-mono text-[10px] font-medium text-foreground bg-secondary/60 hover:bg-secondary transition-colors"
                onClick={() => selectDate("2026-05-18")}
                type="button"
              >
                Next Mon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface StudioTimePickerProps {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string; // HH:MM
}

export function StudioTimePicker({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  disabled,
  id,
  name,
  onChange,
  required,
  value,
}: StudioTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside and Escape handling
  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectSlot = (slot: string) => {
    onChange(slot);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            "dms-field flex h-[var(--control-md)] w-full rounded-[var(--radius-sm)] border border-border bg-card px-3 pr-10 font-mono text-sm tracking-wide text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
            ariaInvalid &&
              "border-destructive/80 ring-2 ring-destructive/15 bg-destructive/[0.02] focus:border-destructive focus:ring-destructive/25",
            className,
          )}
          disabled={disabled}
          id={id}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder="HH:MM"
          required={required}
          type="text"
          value={value}
        />
        <button
          aria-hidden="true"
          className="absolute right-2.5 flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
          tabIndex={-1}
          type="button"
        >
          <ClockIcon className="size-4" />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full right-0 z-50 mt-1.5 w-72 rounded-[var(--radius-lg)] border border-border/90 bg-popover/98 p-3.5 shadow-raised backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 sm:left-0 sm:right-auto"
          role="dialog"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="font-mono text-xs font-bold text-foreground">
              Clinical Slots (30 min)
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              09:00 — 17:30
            </span>
          </div>

          {/* Morning Slots */}
          <div className="mt-2.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Morning Shift
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {MORNING_SLOTS.map((slot) => (
                <button
                  className={cn(
                    "dms-pressable rounded-[var(--radius-sm)] border py-1.5 font-mono text-xs transition-all",
                    value === slot
                      ? "border-primary bg-primary font-bold text-primary-foreground shadow-xs"
                      : "border-border/70 bg-secondary/40 text-foreground hover:border-primary/40 hover:bg-primary/10",
                  )}
                  key={slot}
                  onClick={() => selectSlot(slot)}
                  type="button"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="mt-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Afternoon Shift
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {AFTERNOON_SLOTS.map((slot) => (
                <button
                  className={cn(
                    "dms-pressable rounded-[var(--radius-sm)] border py-1.5 font-mono text-xs transition-all",
                    value === slot
                      ? "border-primary bg-primary font-bold text-primary-foreground shadow-xs"
                      : "border-border/70 bg-secondary/40 text-foreground hover:border-primary/40 hover:bg-primary/10",
                  )}
                  key={slot}
                  onClick={() => selectSlot(slot)}
                  type="button"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
