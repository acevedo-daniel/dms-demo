import {
  AlertCircle,
  ArrowLeft,
  CalendarPlus,
  ClipboardList,
  Pencil,
} from "lucide-react";
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
          className="max-w-lg border-y border-border py-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Patient record
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="patient-record-error-title"
          >
            This patient record could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again or return to
            the patient directory.
          </p>
          <Button asChild className="mt-6" variant="outline">
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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href="/demo/patients"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Patients
      </Link>

      <header className="mt-4 border-b border-border pb-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Patient record
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.03em]">
                {name}
              </h1>
              <span className="font-mono text-xs text-muted-foreground">
                {patient.identifier}
              </span>
              {patient.archivedAt ? (
                <Badge variant="outline">Archived</Badge>
              ) : null}
            </div>
            {patient.email || patient.phone ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {[patient.email, patient.phone].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
          {!patient.archivedAt ? (
            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <Button asChild>
                <Link href={scheduleAppointmentHref}>
                  <CalendarPlus aria-hidden className="size-4" />
                  Create appointment
                </Link>
              </Button>
              <PatientFormPanel
                patient={editablePatient}
                trigger={
                  <Button variant="outline">
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
          <p className="mt-5 border-l-2 border-border pl-3 text-sm leading-6 text-muted-foreground">
            Archived {formatDemoDate(new Date(patient.archivedAt))}. This record
            is read-only and remains available for reference.
          </p>
        ) : null}

        <div aria-label="Patient summary" className="mt-6 flex flex-wrap gap-2">
          <Badge className="font-mono" variant="secondary">
            {patient.completedVisitCount}{" "}
            {patient.completedVisitCount === 1 ? "visit" : "visits"}
          </Badge>
          <Badge variant="outline">{patient.schedulingPreference}</Badge>
          <Badge
            className="border-accent/25 bg-accent-soft text-accent-soft-foreground"
            variant="outline"
          >
            <AlertCircle aria-hidden />
            {patient.clinicalAlert}
          </Badge>
        </div>
      </header>

      {patient.nextAppointment ? (
        <section
          aria-label="Upcoming care and related treatment"
          className="border-b border-border py-7"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-xs">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Upcoming appointment
              </p>
              <h2
                className="mt-3 text-lg font-semibold"
                id="next-appointment-title"
              >
                {formatDemoDate(new Date(patient.nextAppointment.startsAt))} ·{" "}
                {formatDemoTime(new Date(patient.nextAppointment.startsAt))}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {patient.nextAppointment.treatmentName}
                </span>
                <AppointmentStatusBadge
                  status={patient.nextAppointment.status}
                />
              </div>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/demo/schedule?appointment=${patient.nextAppointment.id}`}
                  >
                    View in schedule
                  </Link>
                </Button>
              </div>
            </div>

            {patient.relevantTreatment ? (
              <div className="rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-xs">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  Related treatment
                </p>
                <h2
                  className="mt-3 text-lg font-semibold"
                  id="relevant-treatment-title"
                >
                  {patient.relevantTreatment.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {patient.relevantTreatment.category} ·{" "}
                  {patient.relevantTreatment.defaultDurationMinutes} min
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {patient.relevantTreatment.description}
                </p>
                <div className="mt-4">
                  <Button asChild size="sm" variant="outline">
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
          className="border-b border-border py-7"
        >
          <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Upcoming care
              </p>
              <h2
                className="mt-2 text-lg font-semibold"
                id="next-appointment-title"
              >
                No upcoming appointment scheduled.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Future care will appear here and stays separate from the
                activity history.
              </p>
            </div>
            {!patient.archivedAt ? (
              <Button asChild variant="outline">
                <Link href={scheduleAppointmentHref}>
                  <CalendarPlus aria-hidden className="size-4" />
                  Schedule appointment
                </Link>
              </Button>
            ) : null}
          </div>
        </section>
      )}

      <div className="mt-8">
        <PatientRecordActivity items={patient.timeline} />
      </div>
    </main>
  );
}
