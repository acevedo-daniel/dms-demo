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
  fixedPatientId,
  note,
  onSaved,
  patients,
  treatments,
  trigger,
}: NoteComposerPanelProps) {
  const formId = useId();
  const isEditing = Boolean(note);
  const [isOpen, setIsOpen] = useState(false);
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
    fieldErrors.body || (error?.includes("note") ? error : null);
  const patientError =
    fieldErrors.patientId || (error?.includes("patient") ? error : null);

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
      nextFieldErrors.patientId = "Select a patient before saving this note.";
    }

    if (!values.body.trim()) {
      nextFieldErrors.body = "A note is required.";
    }

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors);
      setError(
        nextFieldErrors.patientId ||
          nextFieldErrors.body ||
          "Please complete required note fields.",
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
          getServerError(payload, "The patient note could not be saved."),
        );
      }

      const savedNote = (payload as { note: SavedPatientNote }).note;
      setInitialFormValues(values);
      setIsOpen(false);
      onSaved?.(savedNote);
      announceWorkspaceFeedback(
        isEditing ? "Patient note updated." : "Patient note saved.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The patient note could not be saved.",
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
              <span className="font-medium text-primary">Note Composer</span>
              <span className="text-muted-foreground/40">·</span>
              <span>Atelier Dental</span>
            </div>
            <DialogTitle className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
              {isEditing ? "Edit patient note" : "Add patient note"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Record a concise operational or clinical annotation for the
              workspace.
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
                    Patient
                  </Label>
                  {patientError ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                      <AlertCircle aria-hidden className="size-3 shrink-0" />
                      Required
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Required association
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
                    <option value="">Select patient</option>
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
                    Treatment
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Optional context
                  </span>
                </div>
                <Select
                  id={`${formId}-treatment`}
                  onChange={(event) =>
                    updateValue("treatmentId", event.target.value)
                  }
                  value={values.treatmentId}
                >
                  <option value="">No treatment association</option>
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
                    Note
                  </Label>
                  {bodyError ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                      <AlertCircle aria-hidden className="size-3 shrink-0" />
                      Required
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Clinical observation
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
                  placeholder="Add a concise coordination detail or treatment observation"
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
                Close
              </Button>
              <Button disabled={isPending} type="submit">
                <FilePenLine aria-hidden className="size-4" />
                {isPending ? "Saving..." : "Save note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setIsDiscardOpen} open={isDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/5">
                <AlertTriangle aria-hidden className="size-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Unsaved Changes
              </span>
            </div>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved note changes will be discarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
              onClick={() => {
                setIsDiscardOpen(false);
                setIsOpen(false);
              }}
            >
              <AlertTriangle aria-hidden className="size-3.5" />
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const NoteComposer = NoteComposerPanel;
