import { ArrowLeft, CalendarPlus, ClipboardList, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
import { ArchivePatientButton } from "@/components/archive-patient-button";
import { PatientNoteAction } from "@/components/patient-note-action";
import {
  PatientFormDialog,
  type EditablePatient,
} from "@/components/patient-form-dialog";
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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        href="/demo/patients"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Patients
      </Link>

      <header className="mt-4 flex flex-col gap-6 border-b border-border pb-7 xl:flex-row xl:items-end xl:justify-between">
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
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <Button asChild>
            <Link href={`/demo/schedule?create=1&patient=${patient.id}`}>
              <CalendarPlus aria-hidden className="size-4" />
              Create appointment
            </Link>
          </Button>
          {!patient.archivedAt ? (
            <PatientFormDialog
              patient={editablePatient}
              trigger={
                <Button variant="outline">
                  <Pencil aria-hidden className="size-4" />
                  Edit
                </Button>
              }
            />
          ) : null}
          {!patient.archivedAt ? (
            <ArchivePatientButton
              isBlocked={Boolean(patient.nextAppointment)}
              patientId={patient.id}
              patientName={name}
            />
          ) : null}
        </div>
      </header>

      {patient.archivedAt ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Archived {formatDemoDate(new Date(patient.archivedAt))}. This record
          remains available for reference.
        </p>
      ) : null}

      <section
        aria-labelledby="next-appointment-title"
        className="border-b border-border py-6"
      >
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Next appointment
        </p>
        {patient.nextAppointment ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold" id="next-appointment-title">
                {formatDemoDate(new Date(patient.nextAppointment.startsAt))} ·{" "}
                {formatDemoTime(new Date(patient.nextAppointment.startsAt))}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {patient.nextAppointment.treatmentName}
              </p>
            </div>
            <AppointmentStatusBadge status={patient.nextAppointment.status} />
          </div>
        ) : (
          <div className="mt-3">
            <h2 className="text-lg font-semibold" id="next-appointment-title">
              No upcoming appointment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an appointment from the schedule workspace when needed.
            </p>
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        {patient.relevantTreatment ? (
          <aside
            aria-labelledby="relevant-treatment-title"
            className="order-1 border-y border-border py-5 xl:order-2 xl:self-start"
          >
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Catalog context
            </p>
            <h2
              className="mt-3 text-lg font-semibold"
              id="relevant-treatment-title"
            >
              Relevant treatment
            </h2>
            <p className="mt-3 font-medium">{patient.relevantTreatment.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {patient.relevantTreatment.category} ·{" "}
              {patient.relevantTreatment.defaultDurationMinutes} minutes
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {patient.relevantTreatment.description}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardList aria-hidden className="size-4" />
              Catalog reference
            </div>
          </aside>
        ) : null}

        <section
          aria-labelledby="activity-title"
          className="order-2 xl:order-1"
        >
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
            {noteOptions ? (
              <PatientNoteAction
                patientId={patient.id}
                patients={noteOptions.patients}
                treatments={noteOptions.treatments}
              />
            ) : null}
          </div>
          {patient.timeline.length ? (
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {patient.timeline.map((item) => {
                const date = new Date(
                  item.kind === "appointment" ? item.startsAt : item.createdAt,
                );

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
                        <p className="text-sm text-muted-foreground">
                          {item.treatmentName}
                        </p>
                        <AppointmentStatusBadge status={item.status} />
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-sm leading-6">{item.body}</p>
                        {item.treatmentName ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.treatmentName}
                          </p>
                        ) : null}
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-5 border-y border-border py-12 text-center">
              <p className="font-medium">
                No appointments or notes have been recorded yet.
              </p>
              {!patient.archivedAt ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button asChild variant="outline">
                    <Link
                      href={`/demo/schedule?create=1&patient=${patient.id}`}
                    >
                      <CalendarPlus aria-hidden className="size-4" />
                      Create appointment
                    </Link>
                  </Button>
                  {noteOptions ? (
                    <PatientNoteAction
                      patientId={patient.id}
                      patients={noteOptions.patients}
                      treatments={noteOptions.treatments}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
