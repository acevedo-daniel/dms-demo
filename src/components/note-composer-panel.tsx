"use client";

import { useId, useState, type ReactNode } from "react";
import { FilePenLine } from "lucide-react";
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
import { Select } from "@/components/ui/select";
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() =>
    initialValues(note, fixedPatientId),
  );
  const [initialFormValues, setInitialFormValues] = useState(values);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialFormValues);
  const bodyError = error?.includes("note") ? error : null;
  const patientError = error?.includes("patient") ? error : null;

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
  }

  async function saveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.patientId) {
      setError("Select a patient before saving this note.");
      return;
    }

    if (!values.body.trim()) {
      setError("A note is required.");
      return;
    }

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
          className="top-0 right-0 left-auto h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 p-0 sm:w-[32rem] sm:max-w-none"
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
          <DialogHeader className="border-b border-border px-6 py-6 text-left">
            <DialogTitle>
              {isEditing ? "Edit patient note" : "Add patient note"}
            </DialogTitle>
            <DialogDescription>
              Record a short operational annotation for the workspace.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex min-h-0 flex-1 flex-col"
            id={formId}
            onSubmit={saveNote}
          >
            <div className="space-y-5 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor={`${formId}-patient`}>Patient</Label>
                {fixedPatient ? (
                  <p className="h-11 rounded-md border border-border px-3 py-2.5 text-sm">
                    {fixedPatient.name} / {fixedPatient.identifier}
                  </p>
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
                        {patient.name} / {patient.identifier}
                      </option>
                    ))}
                  </Select>
                )}
                {patientError ? (
                  <p
                    className="text-sm text-destructive"
                    id={`${formId}-patient-error`}
                    role="alert"
                  >
                    {patientError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-treatment`}>Treatment</Label>
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

              <div className="space-y-2">
                <Label htmlFor={`${formId}-body`}>Note</Label>
                <Textarea
                  aria-describedby={
                    bodyError ? `${formId}-body-error` : undefined
                  }
                  aria-invalid={Boolean(bodyError)}
                  autoFocus
                  id={`${formId}-body`}
                  onChange={(event) => updateValue("body", event.target.value)}
                  placeholder="Add a concise coordination detail"
                  required
                  value={values.body}
                />
                {bodyError ? (
                  <p
                    className="text-sm text-destructive"
                    id={`${formId}-body-error`}
                    role="alert"
                  >
                    {bodyError}
                  </p>
                ) : null}
              </div>
              {error && !bodyError && !patientError ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <DialogFooter className="mt-auto border-t border-border px-6 py-4 sm:justify-between">
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
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved note changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="border border-destructive bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setIsDiscardOpen(false);
                setIsOpen(false);
              }}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const NoteComposer = NoteComposerPanel;
