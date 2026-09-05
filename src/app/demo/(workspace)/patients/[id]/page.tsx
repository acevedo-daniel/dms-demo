import { ArrowLeft, CalendarPlus, ClipboardList, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { ArchivePatientButton } from "@/components/archive-patient-button";
import {
  PatientFormPanel,
  type EditablePatient,
} from "@/components/patient-form-panel";
import { PatientNoteAction } from "@/components/patient-note-action";
import { PatientRecordActivity } from "@/components/patient-record-activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { NotFoundError } from "@/lib/domain/errors";
import { getNoteComposerOptions } from "@/lib/notes";
import { getPatientRecord } from "@/lib/patients";

type PatientPageProps = { params: Promise<{ id: string }> };

function patientName(patient: { firstName: string; lastName: string }) {
  return `${patient.firstName} ${patient.lastName}`;
}

function patientInitials(patient: { firstName: string; lastName: string }) {
  return `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();
}

async function loadPatientRecord(id: string) {
  try {
    return await getPatientRecord(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return "not-found" as const;
    }

    return null;
  }
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const patient = await loadPatientRecord(id);

  if (patient === "not-found") {
    notFound();
  }

  if (!patient) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="patient-record-error-title"
          className="max-w-lg rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              Patient Record
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="patient-record-error-title"
          >
            This patient record could not be loaded.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The sample data is temporarily unavailable. Try again or return to
            the patient directory.
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/patients">Back to patients</Link>
          </Button>
        </section>
      </main>
    );
  }

  let noteOptions: Awaited<ReturnType<typeof getNoteComposerOptions>> | null =
    null;

  if (!patient.archivedAt) {
    try {
      noteOptions = await getNoteComposerOptions();
    } catch {
      noteOptions = null;
    }
  }

  const name = patientName(patient);
  const editablePatient: EditablePatient = {
    email: patient.email,
    firstName: patient.firstName,
    id: patient.id,
    identifier: patient.identifier,
    lastName: patient.lastName,
    phone: patient.phone,
  };
  const scheduleAppointmentHref = `/demo/schedule?create=1&patient=${patient.id}`;
  const hasAlert =
    Boolean(patient.clinicalAlert) &&
    patient.clinicalAlert.toLowerCase() !== "no clinical alert recorded";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Return Link Capsule */}
      <div>
        <Link
          className="dms-pressable inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
          href="/demo/patients"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          <span>Patients</span>
        </Link>
      </div>

      {/* Clinical Header */}
      <header className="mt-4 border-b border-border/70 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-accent">
                Patient Record
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>Atelier Dental</span>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-base font-semibold text-foreground/80"
              >
                {patientInitials(patient)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
                    {name}
                  </h1>
                  <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                    {patient.identifier}
                  </span>
                  {patient.archivedAt ? (
                    <Badge
                      className="border-destructive/30 bg-destructive/5 text-xs font-medium text-destructive"
                      variant="outline"
                    >
                      Archived
                    </Badge>
                  ) : null}
                </div>
                {patient.email || patient.phone ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[patient.email, patient.phone].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {!patient.archivedAt ? (
            <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">
              <Button asChild className="h-10 px-4 font-semibold shadow-xs">
                <Link href={scheduleAppointmentHref}>
                  <CalendarPlus aria-hidden className="size-4" />
                  Create appointment
                </Link>
              </Button>
              <PatientFormPanel
                patient={editablePatient}
                trigger={
                  <Button
                    className="h-10 font-semibold shadow-xs"
                    variant="outline"
                  >
                    <Pencil aria-hidden className="size-4" />
                    Edit
                  </Button>
                }
              />
              {noteOptions ? (
                <PatientNoteAction
                  patientId={patient.id}
                  patients={noteOptions.patients}
                  treatments={noteOptions.treatments}
                />
              ) : null}
              <ArchivePatientButton
                isBlocked={Boolean(patient.nextAppointment)}
                patientId={patient.id}
                patientName={name}
              />
            </div>
          ) : null}
        </div>

        {patient.archivedAt ? (
          <p className="mt-5 rounded-[var(--radius-md)] border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-medium leading-relaxed text-muted-foreground">
            Archived {formatDemoDate(new Date(patient.archivedAt))}. This record
            is read-only and remains available for reference.
          </p>
        ) : null}

        {/* Patient Summary Clinical Vitals Strip (Editorial, No generic icons) */}
        <section
          aria-label="Patient summary"
          className="mt-6 grid grid-cols-1 divide-y divide-border/60 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {/* Clinical Alert Section */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-1.5">
              {hasAlert ? (
                <span className="size-1.5 rounded-full bg-warning" />
              ) : (
                <span className="size-1.5 rounded-full bg-muted-foreground/50" />
              )}
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Clinical Precaution
              </p>
            </div>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              {patient.clinicalAlert}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasAlert
                ? "Review clinical precautions prior to treatment"
                : "Standard practice protocol applies"}
            </p>
          </div>

          {/* Visit History Section */}
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Visit History
            </p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              <span className="tabular-nums">
                {patient.completedVisitCount}
              </span>{" "}
              {patient.completedVisitCount === 1 ? "visit" : "visits"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Completed consultations at Atelier Dental
            </p>
          </div>

          {/* Scheduling Profile Section */}
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Scheduling Profile
            </p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              {patient.schedulingPreference}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Patient preferred appointment timing
            </p>
          </div>
        </section>
      </header>

      {/* Upcoming Care & Related Treatment Section */}
      {patient.nextAppointment ? (
        <section
          aria-label="Upcoming care and related treatment"
          className="border-b border-border/70 py-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 shadow-xs transition-all hover:border-foreground/20 hover:bg-card">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Upcoming appointment
                </p>
                <AppointmentStatusBadge
                  status={patient.nextAppointment.status}
                />
              </div>
              <h2
                className="mt-3 text-lg font-semibold tracking-tight text-foreground"
                id="next-appointment-title"
              >
                {formatDemoDate(new Date(patient.nextAppointment.startsAt))} ·{" "}
                {formatDemoTime(new Date(patient.nextAppointment.startsAt))}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {patient.nextAppointment.treatmentName}
              </p>
              <div className="mt-5">
                <Button
                  asChild
                  className="font-semibold shadow-xs"
                  size="sm"
                  variant="outline"
                >
                  <Link
                    href={`/demo/schedule?appointment=${patient.nextAppointment.id}`}
                  >
                    View in schedule
                  </Link>
                </Button>
              </div>
            </div>

            {patient.relevantTreatment ? (
              <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 shadow-xs transition-all hover:border-foreground/20 hover:bg-card">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Related treatment
                  </p>
                  <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
                    {patient.relevantTreatment.defaultDurationMinutes} min
                  </span>
                </div>
                <h2
                  className="mt-3 text-lg font-semibold tracking-tight text-foreground"
                  id="relevant-treatment-title"
                >
                  {patient.relevantTreatment.name}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {patient.relevantTreatment.category}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {patient.relevantTreatment.description}
                </p>
                <div className="mt-5">
                  <Button
                    asChild
                    className="font-semibold shadow-xs"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/demo/treatments?treatment=${patient.relevantTreatment.id}`}
                    >
                      <ClipboardList aria-hidden className="size-4" />
                      Open treatment
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="next-appointment-title"
          className="border-b border-border/70 py-8"
        >
          <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming care
              </p>
              <h2
                className="mt-1 text-base font-semibold tracking-tight text-foreground"
                id="next-appointment-title"
              >
                No upcoming appointment scheduled.
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Future care will appear here and stays separate from the
                activity history.
              </p>
            </div>
            {!patient.archivedAt ? (
              <Button
                asChild
                className="font-semibold shadow-xs"
                variant="outline"
              >
                <Link href={scheduleAppointmentHref}>
                  <CalendarPlus aria-hidden className="size-4" />
                  Schedule appointment
                </Link>
              </Button>
            ) : null}
          </div>
        </section>
      )}

      {/* Operational Activity History */}
      <div className="mt-8">
        <PatientRecordActivity items={patient.timeline} />
      </div>
    </main>
  );
}
