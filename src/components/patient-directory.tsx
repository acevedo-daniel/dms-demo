"use client";

import Link from "next/link";
import { ChevronRight, Search, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PatientFormPanel,
  type EditablePatient,
} from "@/components/patient-form-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { useI18n, getLocalizedTreatment } from "@/lib/i18n";
import type { PatientDirectoryItem } from "@/lib/patients";
import { cn } from "@/lib/utils";

type PatientDirectoryProps = {
  initialCreate?: boolean;
  initialPatients: PatientDirectoryItem[];
};
type StatusFilter = "all" | "upcoming" | "unscheduled";

function patientName(
  patient: Pick<PatientDirectoryItem, "firstName" | "lastName">,
) {
  return `${patient.firstName} ${patient.lastName}`;
}

function patientInitials(
  patient: Pick<PatientDirectoryItem, "firstName" | "lastName">,
) {
  return `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();
}

function toDirectoryItem(patient: EditablePatient): PatientDirectoryItem {
  return { ...patient, nextAppointment: null };
}

function appointmentSummary(
  patient: PatientDirectoryItem,
  locale: "es" | "en" = "es",
) {
  if (!patient.nextAppointment) {
    return locale === "es" ? "Sin turnos próximos" : "No upcoming visits";
  }

  const startsAt = new Date(patient.nextAppointment.startsAt);
  return `${formatDemoDate(startsAt, locale).replace(", 2026", "")} · ${formatDemoTime(startsAt, locale)}`;
}

function resultLabel(count: number, locale: "es" | "en" = "es") {
  return `${count} ${locale === "es" ? (count === 1 ? "paciente" : "pacientes") : count === 1 ? "patient" : "patients"}`;
}

export function PatientDirectory({
  initialCreate = false,
  initialPatients,
}: PatientDirectoryProps) {
  const { locale, t } = useI18n();
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [resultAnnouncement, setResultAnnouncement] = useState("");
  const pendingFocusPatientId = useRef<string | null>(null);
  const previousResultCount = useRef(initialPatients.length);

  const upcomingCount = useMemo(
    () => patients.filter((patient) => Boolean(patient.nextAppointment)).length,
    [patients],
  );

  const unscheduledCount = patients.length - upcomingCount;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (statusFilter === "upcoming" && !patient.nextAppointment) {
        return false;
      }
      if (statusFilter === "unscheduled" && patient.nextAppointment) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${patient.firstName} ${patient.lastName} ${patient.identifier}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [normalizedQuery, patients, statusFilter]);

  useEffect(() => {
    const nextCount = filteredPatients.length;

    if (previousResultCount.current === nextCount) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setResultAnnouncement(resultLabel(nextCount, locale));
      previousResultCount.current = nextCount;
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [filteredPatients.length, locale]);

  useEffect(() => {
    const patientId = pendingFocusPatientId.current;

    if (!patientId) {
      return;
    }

    document.getElementById(`patient-${patientId}`)?.focus();
    pendingFocusPatientId.current = null;
  }, [patients]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        const target = event.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        event.preventDefault();
        document.getElementById("patient-directory-search")?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handlePatientCreated(patient: EditablePatient) {
    pendingFocusPatientId.current = patient.id;
    setPatients((current) => [toDirectoryItem(patient), ...current]);
    setQuery("");
    setStatusFilter("all");
  }

  return (
    <div>
      {/* Editorial Header */}
      <header className="flex flex-col gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {locale === "es"
                ? "Directorio de pacientes"
                : "Patient directory"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl"
            id="patient-directory-title"
            tabIndex={-1}
          >
            {t.patients.heading}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {locale === "es"
              ? "Registros de la práctica clínica y directorio de pacientes. Consultá citas programadas, perfiles de salud e historiales de tratamiento."
              : "Clinical practice records and patient directory. Review scheduled appointments, health profiles, and treatment histories."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PatientFormPanel
            defaultOpen={initialCreate}
            onSaved={handlePatientCreated}
            trigger={
              <Button className="h-10 px-4 font-semibold shadow-xs">
                <UserPlus aria-hidden className="size-4" />
                {t.patients.addPatient}
              </Button>
            }
          />
        </div>
      </header>

      {/* Artisanal Clinical Ledger Strip */}
      <section
        aria-label={
          locale === "es"
            ? "Resumen del directorio de pacientes"
            : "Patient directory summary"
        }
        className="mt-6 grid grid-cols-1 divide-y divide-border/60 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Padrón activo" : "Active directory"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {patients.length}{" "}
            {locale === "es"
              ? patients.length === 1
                ? "paciente registrado"
                : "pacientes registrados"
              : patients.length === 1
                ? "registered patient"
                : "registered patients"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Historial completo de la práctica clínica"
              : "Complete clinical practice records"}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "es" ? "Atención programada" : "Scheduled care"}
            </p>
          </div>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {upcomingCount}{" "}
            {locale === "es"
              ? upcomingCount === 1
                ? "turno programado"
                : "turnos programados"
              : upcomingCount === 1
                ? "scheduled visit"
                : "scheduled visits"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Agendados en los sillones de la clínica"
              : "Booked across practice operatories"}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Continuidad de atención" : "Care continuity"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {locale === "es" ? "Fichas clínicas" : "Clinical charts"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Evoluciones históricas y protocolos realizados"
              : "Historical evolutions and completed protocols"}
          </p>
        </div>
      </section>

      {/* Search & Segmented Filtering Bar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl flex-1">
          <div className="flex items-center justify-between gap-2">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              htmlFor="patient-directory-search"
            >
              {locale === "es" ? "Buscar paciente" : "Search patients"}
            </label>
            <span
              className="text-xs text-muted-foreground"
              id="patient-directory-result-count"
            >
              {resultLabel(filteredPatients.length, locale)}
            </span>
          </div>
          <div className="relative mt-2">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-describedby="patient-directory-result-count"
              className="h-10 rounded-[var(--radius-md)] border-border/80 bg-background/60 pl-10 pr-20 text-sm shadow-xs backdrop-blur-xs transition-all focus:border-foreground/30 focus:bg-background"
              id="patient-directory-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.patients.searchPlaceholder}
              value={query}
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              {query ? (
                <Button
                  aria-label={
                    locale === "es" ? "Limpiar búsqueda" : "Clear search"
                  }
                  className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => setQuery("")}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X aria-hidden className="size-3.5" />
                </Button>
              ) : (
                <kbd className="hidden items-center gap-0.5 rounded border border-border/70 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground sm:inline-flex">
                  /
                </kbd>
              )}
            </div>
          </div>
          <p aria-atomic="true" aria-live="polite" className="sr-only">
            {resultAnnouncement}
          </p>
        </div>

        {/* Status Filter Segmented Controls */}
        <div
          aria-label={
            locale === "es"
              ? "Filtrar directorio por estado de turnos"
              : "Filter directory by appointment status"
          }
          className="inline-flex items-center rounded-full border border-border/80 bg-surface/80 p-1 shadow-xs backdrop-blur-xs self-start lg:self-end"
          role="group"
        >
          <button
            aria-pressed={statusFilter === "all"}
            className={cn(
              "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all",
              statusFilter === "all"
                ? "bg-secondary text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setStatusFilter("all")}
            type="button"
          >
            <span>{t.patients.filterAll}</span>
            <span className="ml-1 text-muted-foreground">
              ({patients.length})
            </span>
          </button>
          <button
            aria-pressed={statusFilter === "upcoming"}
            className={cn(
              "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all",
              statusFilter === "upcoming"
                ? "bg-secondary text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setStatusFilter("upcoming")}
            type="button"
          >
            <span>{t.patients.filterScheduled}</span>
            <span className="ml-1 text-muted-foreground">
              ({upcomingCount})
            </span>
          </button>
          <button
            aria-pressed={statusFilter === "unscheduled"}
            className={cn(
              "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all",
              statusFilter === "unscheduled"
                ? "bg-secondary text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setStatusFilter("unscheduled")}
            type="button"
          >
            <span>{t.patients.filterNoUpcoming}</span>
            <span className="ml-1 text-muted-foreground">
              ({unscheduledCount})
            </span>
          </button>
        </div>
      </div>

      {/* Patient Directory List */}
      {filteredPatients.length ? (
        <ol className="mt-8 space-y-2">
          {filteredPatients.map((patient) => {
            const localizedTreatment = patient.nextAppointment?.treatmentName
              ? getLocalizedTreatment(
                  {
                    name: patient.nextAppointment.treatmentName,
                  },
                  locale,
                )
              : null;

            return (
              <li className="group" key={patient.id}>
                <Link
                  aria-label={
                    locale === "es"
                      ? `Ver ficha de ${patientName(patient)}`
                      : `View record for ${patientName(patient)}`
                  }
                  className="dms-pressable block rounded-[var(--radius-lg)] border border-border/70 bg-card/30 p-4 transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-4.5"
                  href={`/demo/patients/${patient.id}`}
                  id={`patient-${patient.id}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(14rem,1.3fr)_minmax(12rem,1.1fr)_minmax(10rem,1fr)] sm:items-center sm:gap-6">
                      {/* Patient identity */}
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div
                          aria-hidden
                          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-xs font-semibold text-foreground/80"
                        >
                          {patientInitials(patient)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                              {patientName(patient)}
                            </p>
                            <span className="shrink-0 rounded border border-border/70 bg-secondary/50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                              {patient.identifier}
                            </span>
                          </div>
                          {patient.email || patient.phone ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {patient.email ?? patient.phone}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {/* Next scheduled care */}
                      <div className="text-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {locale === "es" ? "Próximo turno" : "Next visit"}
                        </p>
                        {patient.nextAppointment ? (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                            <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                              {appointmentSummary(patient, locale)}
                            </p>
                          </div>
                        ) : (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground/80 sm:text-sm">
                            {locale === "es"
                              ? "Sin turnos próximos"
                              : "No upcoming visits"}
                          </p>
                        )}
                      </div>

                      {/* Associated treatment */}
                      <div className="text-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {locale === "es" ? "Tratamiento" : "Treatment"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                          {localizedTreatment?.name ??
                            patient.nextAppointment?.treatmentName ??
                            "-"}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100 motion-reduce:transition-none"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : query ? (
        <section
          aria-labelledby="no-patient-results-title"
          className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h2
            className="text-base font-semibold text-foreground"
            id="no-patient-results-title"
          >
            {t.patients.emptySearch}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.patients.emptyDesc}
          </p>
          <Button
            className="mt-4 font-semibold shadow-xs"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            variant="outline"
          >
            {locale === "es" ? "Restablecer búsqueda" : "Reset search"}
          </Button>
        </section>
      ) : (
        <section
          aria-labelledby="no-patients-title"
          className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h2
            className="text-base font-semibold text-foreground"
            id="no-patients-title"
          >
            {locale === "es"
              ? "No hay pacientes activos en el directorio."
              : "No active patients in directory."}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "es"
              ? "Agregá un paciente para iniciar el registro clínico."
              : "Add a patient to start the clinical record."}
          </p>
        </section>
      )}
    </div>
  );
}
