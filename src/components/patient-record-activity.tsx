"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { useI18n } from "@/lib/i18n";
import { getLocalizedTreatment } from "@/lib/i18n/treatment-labels";
import { getLocalizedPatientNote } from "@/lib/i18n/demo-content";
import { cn } from "@/lib/utils";

type ActivityItem =
  | {
      id: string;
      kind: "appointment";
      startsAt: string;
      status: "SCHEDULED" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "CANCELLED";
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
  const { locale, t } = useI18n();
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
    { count: items.length, label: t.patients.record.tabAll, value: "all" },
    {
      count: appointmentsCount,
      label: t.patients.record.tabAppointments,
      value: "appointments",
    },
    { count: notesCount, label: t.patients.record.tabNotes, value: "notes" },
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Cronología operativa" : "Operational timeline"}
          </p>
          <h2
            className="mt-1 text-2xl font-semibold tracking-tight text-foreground"
            id="activity-title"
          >
            {t.patients.record.activityTitle}
          </h2>
        </div>

        {/* Filter Pills with explicit aria-label for E2E testing */}
        <div
          aria-label={
            locale === "es"
              ? "Filtrar actividad del paciente"
              : "Filter patient activity"
          }
          className="inline-flex items-center rounded-full border border-border/80 bg-surface/80 p-1 shadow-xs backdrop-blur-xs"
          role="group"
        >
          {filters.map((option) => (
            <button
              aria-label={option.label}
              aria-pressed={filter === option.value}
              className={cn(
                "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all",
                filter === option.value
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              key={option.value}
              onClick={() => setFilter(option.value)}
              type="button"
            >
              <span>{option.label}</span>
              <span aria-hidden="true" className="ml-1 text-muted-foreground">
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
            const localizedTreatment = item.treatmentName
              ? getLocalizedTreatment(
                  {
                    id: item.treatmentId ?? undefined,
                    name: item.treatmentName,
                  },
                  locale,
                )
              : null;

            return (
              <li
                className="group rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-4 shadow-xs transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs sm:p-5"
                key={`${item.kind}-${item.id}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2 rounded-full",
                        item.kind === "appointment"
                          ? "bg-foreground/50"
                          : "bg-warning",
                      )}
                    />
                    <div>
                      <span className="text-sm font-semibold tracking-tight text-foreground">
                        {item.kind === "appointment"
                          ? locale === "es"
                            ? "Turno clínico"
                            : "Clinical visit"
                          : locale === "es"
                            ? "Nota clínica de evolución"
                            : "Clinical progress note"}
                      </span>
                      <time
                        className="ml-2 text-xs text-muted-foreground"
                        dateTime={date.toISOString()}
                      >
                        <Clock
                          aria-hidden
                          className="mr-1 inline size-3 text-muted-foreground/60"
                        />
                        {formatDemoDate(date, locale)} ·{" "}
                        {formatDemoTime(date, locale)}
                      </time>
                    </div>
                  </div>

                  {item.kind === "appointment" ? (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <AppointmentStatusBadge status={item.status} />
                    </div>
                  ) : localizedTreatment && item.treatmentId ? (
                    <Link
                      className="inline-flex items-center gap-1 rounded border border-border/70 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
                      href={`/demo/treatments?treatment=${item.treatmentId}`}
                    >
                      <span>{localizedTreatment.name}</span>
                    </Link>
                  ) : null}
                </div>

                {item.kind === "appointment" ? (
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {locale === "es" ? "Protocolo:" : "Protocol:"}
                      </span>
                      <span className="font-medium text-foreground">
                        {localizedTreatment?.name ?? item.treatmentName}
                      </span>
                    </div>
                    <Link
                      className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 underline-offset-4 hover:underline hover:text-foreground"
                      href={`/demo/treatments?treatment=${item.treatmentId}`}
                    >
                      <span>
                        {locale === "es"
                          ? "Detalles del protocolo"
                          : "Protocol details"}
                      </span>
                      <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3 rounded-[var(--radius-md)] border border-border/60 bg-secondary/20 p-3.5 text-sm leading-relaxed text-foreground/90">
                    <p className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {getLocalizedPatientNote(item.id, item.body, locale)}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                      <span className="size-1 rounded-full bg-foreground/40" />
                      <span>
                        {locale === "es"
                          ? "Registro clínico de la sesión · Atelier Dental"
                          : "Session clinical record · Atelier Dental"}
                      </span>
                    </div>
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
            {locale === "es"
              ? `No hay registros de ${filter === "all" ? "actividad" : filter === "appointments" ? "turnos" : "notas"}.`
              : `No recorded ${filter === "all" ? "activity" : filter === "appointments" ? "appointments" : "notes"}.`}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.patients.record.emptyActivity}
          </p>
        </section>
      )}
    </section>
  );
}
