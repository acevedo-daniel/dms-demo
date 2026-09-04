"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { Button } from "@/components/ui/button";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";

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

const filters: Array<{ label: string; value: ActivityFilter }> = [
  { label: "All", value: "all" },
  { label: "Appointments", value: "appointments" },
  { label: "Notes", value: "notes" },
];

function itemDate(item: ActivityItem) {
  return new Date(item.kind === "appointment" ? item.startsAt : item.createdAt);
}

export function PatientRecordActivity({ items }: PatientRecordActivityProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const visibleItems = useMemo(
    () =>
      items.filter((item) => filter === "all" || `${item.kind}s` === filter),
    [filter, items],
  );

  return (
    <section aria-labelledby="activity-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Operational history
          </p>
          <h2
            className="mt-3 text-xl font-semibold tracking-tight"
            id="activity-title"
          >
            Activity
          </h2>
        </div>
        <div
          aria-label="Filter patient activity"
          className="inline-flex rounded-[var(--radius-md)] border border-border bg-secondary/40 p-1"
          role="group"
        >
          {filters.map((option) => (
            <Button
              aria-pressed={filter === option.value}
              className={
                filter === option.value
                  ? "bg-background shadow-xs hover:bg-background"
                  : "text-muted-foreground"
              }
              key={option.value}
              onClick={() => setFilter(option.value)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {visibleItems.length ? (
        <ol className="mt-5 divide-y divide-border border-y border-border">
          {visibleItems.map((item) => {
            const date = itemDate(item);

            return (
              <li className="py-5" key={`${item.kind}-${item.id}`}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="font-medium">
                    {item.kind === "appointment" ? "Appointment" : "Note"}
                  </span>
                  <span className="text-muted-foreground">
                    · {formatDemoDate(date)} · {formatDemoTime(date)}
                  </span>
                </div>
                {item.kind === "appointment" ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link
                      className="text-sm text-muted-foreground hover:text-primary"
                      href={`/demo/treatments?treatment=${item.treatmentId}`}
                    >
                      {item.treatmentName}
                    </Link>
                    <AppointmentStatusBadge status={item.status} />
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-sm leading-6">{item.body}</p>
                    {item.treatmentName && item.treatmentId ? (
                      <Link
                        className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                        href={`/demo/treatments?treatment=${item.treatmentId}`}
                      >
                        {item.treatmentName}
                      </Link>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-5 border-y border-border py-12 text-center">
          <p className="font-medium">No {filter} activity is recorded yet.</p>
        </div>
      )}
    </section>
  );
}
