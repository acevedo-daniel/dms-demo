import type { Metadata } from "next";
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
import { getServerTranslations } from "@/lib/i18n/server";
import {
  getLocalizedClinicalAlert,
  getLocalizedTimingPreference,
} from "@/lib/i18n/demo-content";
import { getLocalizedTreatment } from "@/lib/i18n/treatment-labels";
import { getNoteComposerOptions } from "@/lib/notes";
import { getPatientRecord } from "@/lib/patients";

type PatientPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PatientPageProps): Promise<Metadata> {
  const { id } = await params;
  const [{ locale, t }, patient] = await Promise.all([
    getServerTranslations(),
    loadPatientRecord(id),
  ]);

  if (!patient || patient === "not-found") {
    return {
      title: locale === "es" ? "Paciente no encontrado" : "Patient not found",
    };
  }

  const name = patientName(patient);

  return {
    title: t.nav.patientRecordTitle(name),
    description: `${patient.identifier} · ${name}`,
  };
}

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

function localizeSchedulingPref(
  pref: string | null | undefined,
  locale: "es" | "en",
) {
  if (!pref)
    return locale === "es" ? "Preferencia flexible" : "Flexible schedule";
  const lower = pref.toLowerCase();
  if (lower.includes("mañana") || lower.includes("morning")) {
    return locale === "es" ? "Prefiere turno mañana" : "Prefers morning slots";
  }
  if (lower.includes("tarde") || lower.includes("afternoon")) {
    return locale === "es" ? "Prefiere turno tarde" : "Prefers afternoon slots";
  }
  return locale === "es" ? "Horario flexible" : "Flexible schedule";
}

function localizeClinicalAlert(
  alert: string | null | undefined,
  locale: "es" | "en",
) {
  if (!alert)
    return locale === "es"
      ? "Sin alerta médica registrada"
      : "No clinical alert recorded";
  const lower = alert.toLowerCase();
  if (lower.includes("sin alerta") || lower.includes("no clinical alert")) {
    return locale === "es"
      ? "Sin alerta médica registrada"
      : "No clinical alert recorded";
  }
  if (lower.includes("penicilina") || lower.includes("penicillin")) {
    return locale === "es" ? "Alergia a la penicilina" : "Penicillin allergy";
  }
  if (lower.includes("látex") || lower.includes("latex")) {
    return locale === "es" ? "Sensibilidad al látex" : "Latex sensitivity";
  }
  if (lower.includes("hipertens") || lower.includes("hypertens")) {
    return locale === "es"
      ? "Hipertensión controlada"
      : "Controlled hypertension";
  }
  if (lower.includes("anticoagulant")) {
    return locale === "es"
      ? "Paciente bajo anticoagulantes"
      : "Anticoagulant therapy";
  }
  return alert;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const [{ locale }, patient] = await Promise.all([
    getServerTranslations(),
    loadPatientRecord(id),
  ]);

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
              {locale === "es" ? "Ficha del paciente" : "Patient Record"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="patient-record-error-title"
          >
            {locale === "es"
              ? "No se pudo cargar la ficha del paciente."
              : "Could not load patient record."}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {locale === "es"
              ? "Los datos no están disponibles en este momento. Reintentá o volvé al directorio de pacientes."
              : "Patient data is currently unavailable. Please retry or return to the directory."}
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/patients">
              {locale === "es" ? "Volver a pacientes" : "Back to Patients"}
            </Link>
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
  const rawAlert = patient.clinicalAlert ?? "";
  const hasAlert =
    Boolean(rawAlert) &&
    rawAlert.toLowerCase() !== "no clinical alert recorded" &&
    rawAlert.toLowerCase() !== "sin alerta médica registrada";

  const displayAlert = getLocalizedClinicalAlert(
    patient.id,
    localizeClinicalAlert(rawAlert, locale),
    locale,
  );
  const displayPref = getLocalizedTimingPreference(
    localizeSchedulingPref(patient.schedulingPreference, locale),
    locale,
  );

  const localizedRelevantTreatment = patient.relevantTreatment
    ? getLocalizedTreatment(patient.relevantTreatment, locale)
    : null;

  const localizedNextTreatmentName = patient.nextAppointment?.treatmentName
    ? getLocalizedTreatment(
        { name: patient.nextAppointment.treatmentName },
        locale,
      ).name
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Return Link Capsule */}
      <div>
        <Link
          className="dms-pressable inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:bg-secondary hover:text-foreground"
          href="/demo/patients"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          <span>{locale === "es" ? "Pacientes" : "Patients"}</span>
        </Link>
      </div>

      {/* Clinical Header */}
      <header className="mt-4 border-b border-border/70 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:mt-0 xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-accent">
                {locale === "es" ? "Ficha del paciente" : "Patient Record"}
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
                      {locale === "es" ? "Archivado" : "Archived"}
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
                  {locale === "es" ? "Crear turno" : "Schedule appointment"}
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
                    {locale === "es" ? "Editar" : "Edit"}
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
            {locale === "es"
              ? `Ficha archivada el ${formatDemoDate(new Date(patient.archivedAt), locale)}. Este registro es de solo lectura y se conserva como referencia histórica.`
              : `Record archived on ${formatDemoDate(new Date(patient.archivedAt), locale)}. This record is read-only and preserved for clinical reference.`}
          </p>
        ) : null}

        {/* Patient Summary Clinical Vitals Strip */}
        <section
          aria-label={
            locale === "es" ? "Resumen del paciente" : "Patient summary"
          }
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
                {locale === "es" ? "Alerta clínica" : "Clinical Alert"}
              </p>
            </div>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              {displayAlert}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasAlert
                ? locale === "es"
                  ? "Verificar precauciones clínicas antes de iniciar el tratamiento"
                  : "Verify clinical precautions prior to procedure"
                : locale === "es"
                  ? "Aplica protocolo clínico estándar"
                  : "Standard clinical protocol applies"}
            </p>
          </div>

          {/* Visit History Section */}
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "es" ? "Historial de atenciones" : "Completed visits"}
            </p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              <span className="tabular-nums">
                {patient.completedVisitCount}
              </span>{" "}
              {locale === "es"
                ? patient.completedVisitCount === 1
                  ? "consulta"
                  : "consultas"
                : patient.completedVisitCount === 1
                  ? "visit"
                  : "visits"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {locale === "es"
                ? "Consultas finalizadas en Atelier Dental"
                : "Completed appointments at Atelier Dental"}
            </p>
          </div>

          {/* Scheduling Profile Section */}
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "es"
                ? "Preferencia de horario"
                : "Scheduling preference"}
            </p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
              {displayPref}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {locale === "es"
                ? "Franja horaria preferida por el paciente"
                : "Patient's preferred appointment window"}
            </p>
          </div>
        </section>
      </header>

      {/* Upcoming Care & Related Treatment Section */}
      {patient.nextAppointment ? (
        <section
          aria-label={
            locale === "es"
              ? "Próximo turno y tratamiento vinculado"
              : "Upcoming appointment and protocol"
          }
          className="border-b border-border/70 py-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 shadow-xs transition-all hover:border-foreground/20 hover:bg-card">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {locale === "es" ? "Próximo turno" : "Next appointment"}
                </p>
                <AppointmentStatusBadge
                  status={patient.nextAppointment.status}
                />
              </div>
              <h2
                className="mt-3 text-lg font-semibold tracking-tight text-foreground"
                id="next-appointment-title"
              >
                {formatDemoDate(
                  new Date(patient.nextAppointment.startsAt),
                  locale,
                )}{" "}
                ·{" "}
                {formatDemoTime(
                  new Date(patient.nextAppointment.startsAt),
                  locale,
                )}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {localizedNextTreatmentName ??
                  patient.nextAppointment.treatmentName}
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
                    {locale === "es" ? "Ver en la agenda" : "View in schedule"}
                  </Link>
                </Button>
              </div>
            </div>

            {localizedRelevantTreatment ? (
              <div className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 shadow-xs transition-all hover:border-foreground/20 hover:bg-card">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {locale === "es"
                      ? "Tratamiento vinculado"
                      : "Linked treatment"}
                  </p>
                  <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
                    {localizedRelevantTreatment.defaultDurationMinutes} min
                  </span>
                </div>
                <h2
                  className="mt-3 text-lg font-semibold tracking-tight text-foreground"
                  id="relevant-treatment-title"
                >
                  {localizedRelevantTreatment.name}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {localizedRelevantTreatment.category}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {localizedRelevantTreatment.description}
                </p>
                <div className="mt-5">
                  <Button
                    asChild
                    className="font-semibold shadow-xs"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/demo/treatments?treatment=${localizedRelevantTreatment.id}`}
                    >
                      <ClipboardList aria-hidden className="size-4" />
                      {locale === "es" ? "Ver tratamiento" : "View treatment"}
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
                {locale === "es" ? "Atención programada" : "Scheduled care"}
              </p>
              <h2
                className="mt-1 text-base font-semibold tracking-tight text-foreground"
                id="next-appointment-title"
              >
                {locale === "es"
                  ? "Sin turnos próximos agendados."
                  : "No upcoming visits scheduled."}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {locale === "es"
                  ? "Las próximas consultas programadas se reflejarán aquí y se mantienen diferenciadas de la cronología histórica."
                  : "Future visits will be displayed here, differentiated from historical timeline."}
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
                  {locale === "es" ? "Agendar turno" : "Schedule appointment"}
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
