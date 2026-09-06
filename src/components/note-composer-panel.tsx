"use client";

import { useId, useState, type ReactNode } from "react";
import { AlertCircle, AlertTriangle, FilePenLine } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NativeSelect as Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { useI18n } from "@/lib/i18n";
import type {
  NoteComposerPatient,
  NoteComposerTreatment,
  PatientNoteItem,
} from "@/lib/notes";

export type SavedPatientNote = Pick<
  PatientNoteItem,
  "body" | "createdAt" | "id" | "patientId" | "treatmentId"
>;

export type NoteComposerPanelProps = {
  defaultOpen?: boolean;
  fixedPatientId?: string;
  note?: PatientNoteItem;
  onSaved?: (note: SavedPatientNote) => void;
  patients: NoteComposerPatient[];
  treatments: NoteComposerTreatment[];
  trigger: ReactNode;
};

export type NoteComposerProps = NoteComposerPanelProps;

type NoteFormState = {
  body: string;
  patientId: string;
  treatmentId: string;
};

function initialValues(
  note?: PatientNoteItem,
  fixedPatientId?: string,
): NoteFormState {
  return {
    body: note?.body ?? "",
    patientId: fixedPatientId ?? note?.patientId ?? "",
    treatmentId: note?.treatmentId ?? "",
  };
}

function getServerError(payload: unknown, fallback: string) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return fallback;
}

export function NoteComposerPanel({
  defaultOpen = false,
  fixedPatientId,
  note,
  onSaved,
  patients,
  treatments,
  trigger,
}: NoteComposerPanelProps) {
  const { locale, t } = useI18n();
  const formId = useId();
  const isEditing = Boolean(note);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    body?: string;
    patientId?: string;
  }>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() =>
    initialValues(note, fixedPatientId),
  );
  const [initialFormValues, setInitialFormValues] = useState(values);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialFormValues);
  const bodyError =
    fieldErrors.body ||
    (error?.toLowerCase().includes("note") ||
    error?.toLowerCase().includes("nota")
      ? error
      : null);
  const patientError =
    fieldErrors.patientId ||
    (error?.toLowerCase().includes("patient") ||
    error?.toLowerCase().includes("paciente")
      ? error
      : null);

  function requestClose() {
    if (isPending) {
      return;
    }

    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }

    setIsOpen(false);
  }

  function updateValue(field: keyof NoteFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function saveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors: { body?: string; patientId?: string } = {};

    if (!values.patientId) {
      nextFieldErrors.patientId =
        locale === "es"
          ? "Seleccioná un paciente antes de guardar la nota."
          : "Please select a patient before saving.";
    }

    if (!values.body.trim()) {
      nextFieldErrors.body =
        locale === "es"
          ? "El contenido de la nota es obligatorio."
          : "Note content is required.";
    }

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors);
      setError(
        nextFieldErrors.patientId ||
          nextFieldErrors.body ||
          (locale === "es"
            ? "Por favor completá los campos obligatorios."
            : "Please fill in all required fields."),
      );
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(
        note ? `/api/demo/notes/${note.id}` : "/api/demo/notes",
        {
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
          method: note ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          getServerError(
            payload,
            locale === "es"
              ? "No se pudo guardar la nota del paciente."
              : "Could not save patient note.",
          ),
        );
      }

      const savedNote = (payload as { note: SavedPatientNote }).note;
      setInitialFormValues(values);
      setIsOpen(false);
      onSaved?.(savedNote);
      announceWorkspaceFeedback(
        isEditing
          ? locale === "es"
            ? "Nota de paciente actualizada."
            : "Patient note updated."
          : t.notes.composer.feedbackSaved,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : locale === "es"
            ? "No se pudo guardar la nota del paciente."
            : "Could not save patient note.",
      );
    } finally {
      setIsPending(false);
    }
  }

  const fixedPatient = fixedPatientId
    ? patients.find((patient) => patient.id === fixedPatientId)
    : undefined;

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            setError(null);
            setFieldErrors({});
            setValues(initialFormValues);
            setIsOpen(true);
            return;
          }

          requestClose();
        }}
        open={isOpen}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="top-0 right-0 left-auto h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 border-l border-border/80 bg-card/95 p-0 backdrop-blur-md shadow-dialog duration-[var(--motion-base)] sm:w-[32rem] sm:max-w-none"
          onEscapeKeyDown={(event) => {
            if (isDirty) {
              event.preventDefault();
              setIsDiscardOpen(true);
            }
          }}
          onPointerDownOutside={(event) => {
            if (isDirty) {
              event.preventDefault();
              setIsDiscardOpen(true);
            }
          }}
        >
          <DialogHeader className="border-b border-border/80 bg-secondary/15 px-6 py-5 text-left">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {locale === "es" ? "Editor de notas" : "Note Editor"}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span>Atelier Dental</span>
            </div>
            <DialogTitle className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
              {isEditing
                ? locale === "es"
                  ? "Editar nota de paciente"
                  : "Edit patient note"
                : t.notes.composer.title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {t.notes.composer.description}
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex min-h-0 flex-1 flex-col"
            id={formId}
            noValidate
            onSubmit={saveNote}
          >
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* Patient Association */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-xs font-semibold text-foreground"
                    htmlFor={`${formId}-patient`}
                  >
                    {t.notes.composer.patient}
                  </Label>
                  {patientError ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                      <AlertCircle aria-hidden className="size-3 shrink-0" />
                      {locale === "es" ? "Obligatorio" : "Required"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {locale === "es"
                        ? "Asociación requerida"
                        : "Association required"}
                    </span>
                  )}
                </div>
                {fixedPatient ? (
                  <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border/70 bg-secondary/30 px-3.5 py-2.5">
                    <span className="text-sm font-medium text-foreground">
                      {fixedPatient.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {fixedPatient.identifier}
                    </span>
                  </div>
                ) : (
                  <Select
                    aria-describedby={
                      patientError ? `${formId}-patient-error` : undefined
                    }
                    aria-invalid={Boolean(patientError)}
                    id={`${formId}-patient`}
                    onChange={(event) =>
                      updateValue("patientId", event.target.value)
                    }
                    required
                    value={values.patientId}
                  >
                    <option value="">{t.notes.composer.selectPatient}</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.identifier})
                      </option>
                    ))}
                  </Select>
                )}
                {patientError ? (
                  <p
                    className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                    id={`${formId}-patient-error`}
                    role="alert"
                  >
                    <AlertCircle aria-hidden className="size-3.5 shrink-0" />
                    {patientError}
                  </p>
                ) : null}
              </div>

              {/* Treatment Protocol Association */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-xs font-semibold text-foreground"
                    htmlFor={`${formId}-treatment`}
                  >
                    {t.notes.composer.category}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {locale === "es" ? "Contexto opcional" : "Optional context"}
                  </span>
                </div>
                <Select
                  id={`${formId}-treatment`}
                  onChange={(event) =>
                    updateValue("treatmentId", event.target.value)
                  }
                  value={values.treatmentId}
                >
                  <option value="">
                    {locale === "es"
                      ? "Sin vinculación a tratamiento"
                      : "No linked treatment"}
                  </option>
                  {treatments.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                      {treatment.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Note Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-xs font-semibold text-foreground"
                    htmlFor={`${formId}-body`}
                  >
                    {t.notes.composer.content}
                  </Label>
                  {bodyError ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                      <AlertCircle aria-hidden className="size-3 shrink-0" />
                      {locale === "es" ? "Obligatorio" : "Required"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {locale === "es"
                        ? "Observación clínica"
                        : "Clinical observation"}
                    </span>
                  )}
                </div>
                <Textarea
                  aria-describedby={
                    bodyError ? `${formId}-body-error` : undefined
                  }
                  aria-invalid={Boolean(bodyError)}
                  autoFocus
                  className="min-h-[9rem] text-sm leading-relaxed"
                  id={`${formId}-body`}
                  onChange={(event) => updateValue("body", event.target.value)}
                  placeholder={t.notes.composer.contentPlaceholder}
                  required
                  value={values.body}
                />
                {bodyError ? (
                  <p
                    className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
                    id={`${formId}-body-error`}
                    role="alert"
                  >
                    <AlertCircle aria-hidden className="size-3.5 shrink-0" />
                    {bodyError}
                  </p>
                ) : null}
              </div>

              {error && !bodyError && !patientError ? (
                <div
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
                  role="alert"
                >
                  <AlertCircle aria-hidden className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}
            </div>

            <DialogFooter className="mt-auto border-t border-border/80 bg-secondary/15 px-6 py-4 sm:justify-between">
              <Button onClick={requestClose} type="button" variant="ghost">
                {locale === "es" ? "Cerrar" : "Close"}
              </Button>
              <Button disabled={isPending} type="submit">
                <FilePenLine aria-hidden className="size-4" />
                {isPending
                  ? t.notes.composer.submitting
                  : t.notes.composer.submit}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setIsDiscardOpen} open={isDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-foreground/80">
                <AlertTriangle
                  aria-hidden
                  className="size-4 text-foreground/80"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {locale === "es" ? "Cambios sin guardar" : "Unsaved changes"}
              </span>
            </div>
            <AlertDialogTitle>
              {locale === "es" ? "¿Descartar cambios?" : "Discard changes?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === "es"
                ? "Se perderán las modificaciones no guardadas en la nota."
                : "Unsaved modifications to this note will be lost."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>
              {locale === "es" ? "Continuar editando" : "Continue editing"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
              onClick={() => {
                setIsDiscardOpen(false);
                setIsOpen(false);
              }}
            >
              <AlertTriangle aria-hidden className="size-3.5" />
              {locale === "es" ? "Descartar cambios" : "Discard changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const NoteComposer = NoteComposerPanel;
