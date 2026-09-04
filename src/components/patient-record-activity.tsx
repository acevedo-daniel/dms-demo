"use client";

import Link from "next/link";
import { Calendar, Clock, FileText, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { cn } from "@/lib/utils";

type ActivityItem =
  | {
      id: string;
      kind: "appointment";
      startsAt: string;
      status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
      treatmentId: string;
      treatmentName: string;
    }
  | {
      body: string;
      createdAt: string;
      id: string;
      kind: "note";
      treatmentId: string | null;
      treatmentName: string | null;
    };

type ActivityFilter = "all" | "appointments" | "notes";

type PatientRecordActivityProps = {
  items: ActivityItem[];
};

function itemDate(item: ActivityItem) {
  return new Date(item.kind === "appointment" ? item.startsAt : item.createdAt);
}

export function PatientRecordActivity({ items }: PatientRecordActivityProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const appointmentsCount = useMemo(
    () => items.filter((item) => item.kind === "appointment").length,
    [items],
  );

  const notesCount = useMemo(
    () => items.filter((item) => item.kind === "note").length,
    [items],
  );

  const filters: Array<{
    count: number;
    label: string;
    value: ActivityFilter;
  }> = [
    { count: items.length, label: "All", value: "all" },
    { count: appointmentsCount, label: "Appointments", value: "appointments" },
    { count: notesCount, label: "Notes", value: "notes" },
  ];

  const visibleItems = useMemo(
    () =>
      items.filter((item) => filter === "all" || `${item.kind}s` === filter),
    [filter, items],
  );

  return (
    <section aria-labelledby="activity-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Operational history
          </p>
          <h2
            className="mt-1 text-2xl font-semibold tracking-tight text-foreground"
            id="activity-title"
          >
            Activity
          </h2>
        </div>

        {/* Filter Pills */}
        <div
          aria-label="Filter patient activity"
          className="flex items-center gap-1.5 overflow-x-auto pb-1"
          role="group"
        >
          {filters.map((option) => (
            <button
              aria-label={option.label}
              aria-pressed={filter === option.value}
              className={cn(
                "dms-pressable inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-all whitespace-nowrap",
                filter === option.value
                  ? "border border-primary/20 bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "border border-border/70 bg-secondary/50 text-muted-foreground hover:border-foreground/20 hover:bg-secondary hover:text-foreground",
              )}
              key={option.value}
              onClick={() => setFilter(option.value)}
              type="button"
            >
              <span>{option.label}</span>
              <span aria-hidden="true" className="opacity-80">
                ({option.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {visibleItems.length ? (
        <ol className="mt-6 space-y-3">
          {visibleItems.map((item) => {
            const date = itemDate(item);

            return (
              <li
                className="group rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-4 transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs sm:p-5"
                key={`${item.kind}-${item.id}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      aria-hidden
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        item.kind === "appointment"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent-soft text-accent-soft-foreground",
                      )}
                    >
                      {item.kind === "appointment" ? (
                        <Calendar className="size-4" />
                      ) : (
                        <FileText className="size-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold tracking-tight text-foreground">
                        {item.kind === "appointment" ? "Appointment" : "Note"}
                      </span>
                      <time
                        className="ml-2.5 font-mono text-xs text-muted-foreground"
                        dateTime={date.toISOString()}
                      >
                        <Clock
                          aria-hidden
                          className="mr-1 inline size-3 text-muted-foreground/60"
                        />
                        {formatDemoDate(date)} · {formatDemoTime(date)}
                      </time>
                    </div>
                  </div>

                  {item.kind === "appointment" ? (
                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      <AppointmentStatusBadge status={item.status} />
                    </div>
                  ) : item.treatmentName && item.treatmentId ? (
                    <Link
                      className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                      href={`/demo/treatments?treatment=${item.treatmentId}`}
                    >
                      <Sparkles aria-hidden className="size-3 text-primary" />
                      <span>{item.treatmentName}</span>
                    </Link>
                  ) : null}
                </div>

                {item.kind === "appointment" ? (
                  <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      Treatment:
                    </span>
                    <Link
                      className="font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline"
                      href={`/demo/treatments?treatment=${item.treatmentId}`}
                    >
                      {item.treatmentName} &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3 rounded-[var(--radius-md)] border border-border/50 bg-secondary/20 p-3.5 text-sm leading-relaxed text-foreground/90">
                    <p className="whitespace-pre-wrap">{item.body}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <section
          aria-labelledby="no-activity-title"
          className="mt-6 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h3
            className="text-base font-semibold text-foreground"
            id="no-activity-title"
          >
            No {filter} activity is recorded yet.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity entries will appear here chronologically as care is
            delivered.
          </p>
        </section>
      )}
    </section>
  );
}
