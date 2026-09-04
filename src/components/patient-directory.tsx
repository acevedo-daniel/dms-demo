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
import type { PatientDirectoryItem } from "@/lib/patients";

type PatientDirectoryProps = { initialPatients: PatientDirectoryItem[] };

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

function appointmentSummary(patient: PatientDirectoryItem) {
  if (!patient.nextAppointment) {
    return "No appointment scheduled";
  }

  const startsAt = new Date(patient.nextAppointment.startsAt);
  return `${formatDemoDate(startsAt).replace(", 2026", "")} · ${formatDemoTime(startsAt)}`;
}

function resultLabel(count: number) {
  return `${count} ${count === 1 ? "patient" : "patients"}`;
}

export function PatientDirectory({ initialPatients }: PatientDirectoryProps) {
  const [patients, setPatients] = useState(initialPatients);
  const [query, setQuery] = useState("");
  const [resultAnnouncement, setResultAnnouncement] = useState("");
  const pendingFocusPatientId = useRef<string | null>(null);
  const previousResultCount = useRef(initialPatients.length);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPatients = useMemo(() => {
    if (!normalizedQuery) {
      return patients;
    }

    return patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName} ${patient.identifier}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery, patients]);

  useEffect(() => {
    const nextCount = filteredPatients.length;

    if (previousResultCount.current === nextCount) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setResultAnnouncement(resultLabel(nextCount));
      previousResultCount.current = nextCount;
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [filteredPatients.length]);

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
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Patient directory
            </span>
            <span className="font-mono text-xs text-muted-foreground/50">
              /
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Atelier Dental
            </span>
          </div>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground"
            id="patient-directory-title"
            tabIndex={-1}
          >
            Patients
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Operational directory and patient records. Search by name or
            clinical identifier, review upcoming visits, or register a new
            intake.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PatientFormPanel
            onSaved={handlePatientCreated}
            trigger={
              <Button className="h-10 px-4 font-semibold shadow-xs">
                <UserPlus aria-hidden className="size-4" />
                Add patient
              </Button>
            }
          />
        </div>
      </header>

      <div className="mt-8 max-w-2xl">
        <div className="flex items-center justify-between gap-2">
          <label
            className="text-sm font-semibold text-foreground"
            htmlFor="patient-directory-search"
          >
            Find a patient
          </label>
          <span
            className="font-mono text-xs text-muted-foreground"
            id="patient-directory-result-count"
          >
            {resultLabel(filteredPatients.length)}
          </span>
        </div>
        <div className="relative mt-2">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-describedby="patient-directory-result-count"
            className="h-11 rounded-[var(--radius-md)] border-border/80 bg-background/60 pl-10 pr-20 text-sm shadow-xs backdrop-blur-xs transition-all focus:border-foreground/30 focus:bg-background"
            id="patient-directory-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or identifier"
            value={query}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1.5">
            {query ? (
              <Button
                aria-label="Clear patient search"
                className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden className="size-3.5" />
              </Button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/70 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </div>
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {resultAnnouncement}
        </p>
      </div>

      {filteredPatients.length ? (
        <ol className="mt-8 space-y-2.5">
          {filteredPatients.map((patient) => (
            <li className="group" key={patient.id}>
              <Link
                aria-label={`Open patient ${patientName(patient)}`}
                className="dms-pressable block rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-4 transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-5"
                href={`/demo/patients/${patient.id}`}
                id={`patient-${patient.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(14rem,1.3fr)_minmax(11rem,1fr)_minmax(11rem,1fr)] sm:items-center sm:gap-6">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary"
                      >
                        {patientInitials(patient)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                            {patientName(patient)}
                          </p>
                          <span className="shrink-0 rounded-full border border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                            {patient.identifier}
                          </span>
                        </div>
                        {patient.email || patient.phone ? (
                          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                            {patient.email ?? patient.phone}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Next appointment
                      </p>
                      <p
                        className={
                          patient.nextAppointment
                            ? "mt-1 truncate font-mono text-xs font-semibold text-foreground sm:text-sm"
                            : "mt-1 truncate text-xs text-muted-foreground sm:text-sm"
                        }
                      >
                        {appointmentSummary(patient)}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Treatment
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                        {patient.nextAppointment?.treatmentName ?? "—"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground opacity-40 transition-all duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-foreground motion-reduce:transition-none"
                  />
                </div>
              </Link>
            </li>
          ))}
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
            No patients match this search.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try searching by a different name, last name, or clinical
            identifier.
          </p>
          <Button
            className="mt-4"
            onClick={() => setQuery("")}
            variant="outline"
          >
            Clear search
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
            No active patients are available.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a patient to start building the directory.
          </p>
        </section>
      )}
    </div>
  );
}
