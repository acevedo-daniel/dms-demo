"use client";

import Link from "next/link";
import { Search, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PatientFormDialog,
  type EditablePatient,
} from "@/components/patient-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import type { PatientDirectoryItem } from "@/lib/patients";

type PatientDirectoryProps = { initialPatients: PatientDirectoryItem[] };

function patientName(
  patient: Pick<PatientDirectoryItem, "firstName" | "lastName">,
) {
  return `${patient.firstName} ${patient.lastName}`;
}

function toDirectoryItem(patient: EditablePatient): PatientDirectoryItem {
  return { ...patient, nextAppointment: null };
}

function AppointmentSummary({ patient }: { patient: PatientDirectoryItem }) {
  if (!patient.nextAppointment) {
    return <span className="text-muted-foreground">—</span>;
  }

  const startsAt = new Date(patient.nextAppointment.startsAt);
  return (
    <span>
      {formatDemoDate(startsAt).replace(", 2026", "")} ·{" "}
      {formatDemoTime(startsAt)}
    </span>
  );
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

  function handlePatientCreated(patient: EditablePatient) {
    const directoryPatient = toDirectoryItem(patient);
    pendingFocusPatientId.current = patient.id;
    setPatients((current) => [directoryPatient, ...current]);
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
        </div>
        <PatientFormDialog
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
        <>
          <div className="mt-8 hidden overflow-hidden border-y border-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Patient</TableHead>
                  <TableHead scope="col">Identifier</TableHead>
                  <TableHead scope="col">Next appointment</TableHead>
                  <TableHead scope="col">Treatment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Link
                        className="font-medium text-foreground hover:text-primary"
                        href={`/demo/patients/${patient.id}`}
                        id={`patient-${patient.id}`}
                      >
                        {patientName(patient)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {patient.identifier}
                    </TableCell>
                    <TableCell className="text-sm">
                      <AppointmentSummary patient={patient} />
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-sm text-muted-foreground">
                      {patient.nextAppointment?.treatmentName ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ol className="mt-8 divide-y divide-border border-y border-border md:hidden">
            {filteredPatients.map((patient) => (
              <li className="py-5" key={patient.id}>
                <Link
                  aria-label={`Open patient ${patientName(patient)}`}
                  className="dms-pressable block rounded-[var(--radius-md)] px-3 py-2 -mx-3 -my-2 hover:bg-secondary/70 focus:outline-none"
                  href={`/demo/patients/${patient.id}`}
                  id={`patient-${patient.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium">{patientName(patient)}</p>
                    <span className="font-mono text-xs text-muted-foreground">
                      {patient.identifier}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Next appointment
                      </dt>
                      <dd className="mt-1">
                        <AppointmentSummary patient={patient} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Treatment
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {patient.nextAppointment?.treatmentName ?? "—"}
                      </dd>
                    </div>
                  </dl>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : query ? (
        <section
          className="mt-8 border-y border-border py-12 text-center"
          aria-labelledby="no-patient-results-title"
        >
          <h2 className="font-medium" id="no-patient-results-title">
            No patients match “{query}”.
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
          className="mt-8 border-y border-border py-12 text-center"
          aria-labelledby="no-patients-title"
        >
          <h2 className="font-medium" id="no-patients-title">
            No patients are available in this workspace.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a patient to start building the directory.
          </p>
        </section>
      )}
    </div>
  );
}
