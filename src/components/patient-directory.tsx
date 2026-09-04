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
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Patient directory
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="patient-directory-title"
            tabIndex={-1}
          >
            Patients
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Find a person, review their operational context, and continue the
            scheduling flow without losing the record.
          </p>
        </div>
        <PatientFormPanel
          onSaved={handlePatientCreated}
          trigger={
            <Button>
              <UserPlus aria-hidden className="size-4" />
              Add patient
            </Button>
          }
        />
      </header>

      <div className="mt-7 max-w-2xl">
        <label
          className="text-sm font-medium"
          htmlFor="patient-directory-search"
        >
          Find a patient
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-describedby="patient-directory-result-count"
            className="pl-10 pr-11"
            id="patient-directory-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or identifier"
            value={query}
          />
          {query ? (
            <Button
              aria-label="Clear patient search"
              className="absolute top-0 right-0"
              onClick={() => setQuery("")}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X aria-hidden className="size-4" />
            </Button>
          ) : null}
        </div>
        <p
          className="mt-3 text-sm text-muted-foreground"
          id="patient-directory-result-count"
        >
          {resultLabel(filteredPatients.length)}
        </p>
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {resultAnnouncement}
        </p>
      </div>

      {filteredPatients.length ? (
        <ol className="mt-8 divide-y divide-border border-y border-border">
          {filteredPatients.map((patient) => (
            <li className="group" key={patient.id}>
              <Link
                aria-label={`Open patient ${patientName(patient)}`}
                className="dms-pressable -mx-3 block rounded-[var(--radius-md)] px-3 py-5 transition-colors hover:bg-secondary/70 focus:outline-none sm:px-5"
                href={`/demo/patients/${patient.id}`}
                id={`patient-${patient.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(13rem,1.2fr)_minmax(9rem,.8fr)_minmax(11rem,1fr)] sm:items-center sm:gap-6">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-mono text-xs font-semibold text-foreground"
                      >
                        {patientInitials(patient)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold tracking-tight group-hover:text-primary">
                          {patientName(patient)}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {patient.identifier}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Next appointment
                      </p>
                      <p className="mt-1 truncate">
                        {appointmentSummary(patient)}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Treatment
                      </p>
                      <p className="mt-1 truncate text-muted-foreground">
                        {patient.nextAppointment?.treatmentName ?? "—"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:opacity-70 motion-reduce:transition-none"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : query ? (
        <section
          aria-labelledby="no-patient-results-title"
          className="mt-8 border-y border-border py-12 text-center"
        >
          <h2 className="font-medium" id="no-patient-results-title">
            No patients match this search.
          </h2>
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
          className="mt-8 border-y border-border py-12 text-center"
        >
          <h2 className="font-medium" id="no-patients-title">
            No active patients are available.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a patient to start building the directory.
          </p>
        </section>
      )}
    </div>
  );
}
