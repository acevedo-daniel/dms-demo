"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, UserPlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";

export type EditablePatient = {
  email: string | null;
  firstName: string;
  id: string;
  identifier: string;
  lastName: string;
  phone: string | null;
};

type PatientFormDialogProps = {
  onSaved?: (patient: EditablePatient) => void;
  patient?: EditablePatient;
  trigger: ReactNode;
};

type PatientFormState = {
  email: string;
  firstName: string;
  identifier: string;
  lastName: string;
  phone: string;
};

function toFormState(patient?: EditablePatient): PatientFormState {
  return {
    email: patient?.email ?? "",
    firstName: patient?.firstName ?? "",
    identifier: patient?.identifier ?? "",
    lastName: patient?.lastName ?? "",
    phone: patient?.phone ?? "",
  };
}

function getServerMessage(payload: unknown, fallback: string) {
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

export function PatientFormDialog({
  onSaved,
  patient,
  trigger,
}: PatientFormDialogProps) {
  const router = useRouter();
  const formId = useId();
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() => toFormState(patient));
  const [initialValues, setInitialValues] = useState(() =>
    toFormState(patient),
  );
  const isEditing = Boolean(patient);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const identifierError = error?.includes("identifier") ? error : null;

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

  function updateValue(field: keyof PatientFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function savePatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(
        patient ? `/api/demo/patients/${patient.id}` : "/api/demo/patients",
        {
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
          method: patient ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as EditablePatient;

      if (!response.ok) {
        throw new Error(
          getServerMessage(payload, "The patient could not be saved."),
        );
      }

      const savedValues = toFormState(payload);
      setInitialValues(savedValues);
      setValues(savedValues);
      setIsOpen(false);
      onSaved?.(payload);
      announceWorkspaceFeedback(
        isEditing ? "Patient updated." : "Patient added.",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The patient could not be saved.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            setError(null);
            setValues(initialValues);
            setIsOpen(true);
            return;
          }

          requestClose();
        }}
        open={isOpen}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="top-0 right-0 left-auto h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 p-0 sm:w-[30rem] sm:max-w-none"
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
              {isEditing ? "Edit patient" : "Add patient"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the patient’s operational contact record."
                : "Create a patient record for the Atelier Dental workspace."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex min-h-0 flex-1 flex-col"
            id={formId}
            onSubmit={savePatient}
          >
            <div className="space-y-5 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor={`${formId}-identifier`}>Identifier</Label>
                <Input
                  aria-describedby={
                    identifierError ? `${formId}-identifier-error` : undefined
                  }
                  aria-invalid={Boolean(identifierError)}
                  autoComplete="off"
                  id={`${formId}-identifier`}
                  onChange={(event) =>
                    updateValue("identifier", event.target.value)
                  }
                  required
                  value={values.identifier}
                />
                {identifierError ? (
                  <p
                    className="text-sm text-destructive"
                    id={`${formId}-identifier-error`}
                  >
                    {identifierError}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-first-name`}>First name</Label>
                  <Input
                    id={`${formId}-first-name`}
                    onChange={(event) =>
                      updateValue("firstName", event.target.value)
                    }
                    required
                    value={values.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-last-name`}>Last name</Label>
                  <Input
                    id={`${formId}-last-name`}
                    onChange={(event) =>
                      updateValue("lastName", event.target.value)
                    }
                    required
                    value={values.lastName}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-email`}>Email</Label>
                <Input
                  id={`${formId}-email`}
                  onChange={(event) => updateValue("email", event.target.value)}
                  type="text"
                  value={values.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-phone`}>Phone</Label>
                <Input
                  id={`${formId}-phone`}
                  onChange={(event) => updateValue("phone", event.target.value)}
                  type="tel"
                  value={values.phone}
                />
              </div>
              {error && !identifierError ? (
                <p aria-live="polite" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
            <DialogFooter className="mt-auto border-t border-border px-6 py-4 sm:justify-between">
              <Button onClick={requestClose} type="button" variant="ghost">
                Close
              </Button>
              <Button disabled={isPending} type="submit">
                <UserPlus aria-hidden className="size-4" />
                {isPending
                  ? isEditing
                    ? "Saving…"
                    : "Adding…"
                  : isEditing
                    ? "Save changes"
                    : "Add patient"}
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
              Your unsaved patient changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setIsDiscardOpen(false);
                setIsOpen(false);
              }}
            >
              <AlertTriangle aria-hidden className="size-4" />
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
