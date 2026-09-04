"use client";

import { useId, useState, type ReactNode } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AppointmentForm,
  type AppointmentFormState,
} from "@/components/appointment-form";
import {
  practiceDateInputValue,
  practiceTimeInputValue,
  toPracticeDateTime,
} from "@/lib/demo/schedule";
import type {
  ScheduleAppointment,
  SchedulePatient,
  ScheduleTreatment,
} from "@/lib/schedule-data";

export type ScheduleContextPanelProps = {
  appointment?: ScheduleAppointment;
  initialPatientId?: string;
  initialStartsAt?: string;
  initialTreatmentId?: string;
  onOpenChange: (open: boolean) => void;
  onDurationChange?: (durationMinutes: number) => void;
  onSaved: (result: ScheduleMutationResult) => void;
  open: boolean;
  patients: SchedulePatient[];
  presentation: "integrated" | "overlay";
  treatments: ScheduleTreatment[];
};

export type ScheduleMutationResult = {
  message: string;
  startsAt: string;
};

function initialValues({
  appointment,
  initialPatientId,
  initialStartsAt,
  initialTreatmentId,
  treatments,
}: Pick<
  ScheduleContextPanelProps,
  | "appointment"
  | "initialPatientId"
  | "initialStartsAt"
  | "initialTreatmentId"
  | "treatments"
>): AppointmentFormState {
  const startsAt = new Date(
    initialStartsAt ?? appointment?.startsAt ?? "2026-05-12T12:00:00.000Z",
  );
  const treatment = treatments.find(
    (item) => item.id === (appointment?.treatmentId ?? initialTreatmentId),
  );

  return {
    date: practiceDateInputValue(startsAt),
    durationMinutes: String(
      appointment?.durationMinutes ?? treatment?.defaultDurationMinutes ?? 30,
    ),
    note: appointment?.note ?? "",
    patientId: appointment?.patientId ?? initialPatientId ?? "",
    time: practiceTimeInputValue(startsAt),
    treatmentId: appointment?.treatmentId ?? initialTreatmentId ?? "",
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

export function ScheduleContextFrame({
  children,
  isDirty,
  onRequestClose,
  open,
  presentation,
}: {
  children: (isOverlay: boolean) => ReactNode;
  isDirty: boolean;
  onRequestClose: () => void;
  open: boolean;
  presentation: ScheduleContextPanelProps["presentation"];
}) {
  if (presentation === "integrated") {
    return (
      <aside
        aria-label="Appointment context"
        className="sticky top-[calc(var(--header-height)+1rem)] flex max-h-[calc(100vh-var(--header-height)-2rem)] min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-raised"
        onKeyDownCapture={(event) => {
          if (event.key === "Escape" && isDirty) {
            event.preventDefault();
            event.stopPropagation();
            onRequestClose();
          }
        }}
      >
        {children(false)}
      </aside>
    );
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onRequestClose();
        }
      }}
      open={open}
    >
      <DialogContent
        className="top-0 right-0 left-auto h-dvh w-full max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 p-0 md:w-[32rem] md:max-w-none"
        onEscapeKeyDown={(event) => {
          if (isDirty) {
            event.preventDefault();
            onRequestClose();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isDirty) {
            event.preventDefault();
            onRequestClose();
          }
        }}
      >
        {children(true)}
      </DialogContent>
    </Dialog>
  );
}

export function ScheduleContextPanel({
  appointment,
  initialPatientId,
  initialStartsAt,
  initialTreatmentId,
  onOpenChange,
  onDurationChange,
  onSaved,
  open,
  patients,
  presentation,
  treatments,
}: ScheduleContextPanelProps) {
  const formId = useId();
  const isEditing = Boolean(appointment);
  const [values, setValues] = useState(() =>
    initialValues({
      appointment,
      initialPatientId,
      initialStartsAt,
      initialTreatmentId,
      treatments,
    }),
  );
  const [initialFormValues, setInitialFormValues] = useState(values);
  const [error, setError] = useState<string | null>(null);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isStatusPending, setIsStatusPending] = useState(false);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialFormValues);
  const dateTimeError =
    error &&
    /(overlaps|Monday through Friday|30-minute slot|fit within|valid appointment date and time)/i.test(
      error,
    )
      ? error
      : null;
  const durationError =
    error && /duration/i.test(error) && !dateTimeError ? error : null;

  function updateValue(field: keyof AppointmentFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    if (field === "durationMinutes") {
      onDurationChange?.(Number(value));
    }
  }

  function requestClose() {
    if (isPending || isStatusPending) {
      return;
    }

    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }

    onOpenChange(false);
  }

  async function saveAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startsAt = toPracticeDateTime(values.date, values.time);

    if (!startsAt) {
      setError("Enter a valid appointment date and time.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(
        appointment
          ? `/api/demo/appointments/${appointment.id}`
          : "/api/demo/appointments",
        {
          body: JSON.stringify({
            durationMinutes: Number(values.durationMinutes),
            note: values.note || undefined,
            patientId: values.patientId,
            startsAt: startsAt.toISOString(),
            treatmentId: values.treatmentId,
          }),
          headers: { "Content-Type": "application/json" },
          method: appointment ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as {
        appointment?: { startsAt?: string };
      };

      if (!response.ok) {
        throw new Error(
          getServerError(payload, "The appointment could not be saved."),
        );
      }

      setInitialFormValues(values);
      onOpenChange(false);
      onSaved({
        message: isEditing ? "Appointment updated." : "Appointment created.",
        startsAt: payload.appointment?.startsAt ?? startsAt.toISOString(),
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The appointment could not be saved.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function updateStatus(status: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
    if (!appointment) {
      return;
    }

    setError(null);
    setIsStatusPending(true);

    try {
      const response = await fetch(`/api/demo/appointments/${appointment.id}`, {
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = (await response.json()) as {
        appointment?: { startsAt?: string };
      };

      if (!response.ok) {
        throw new Error(
          getServerError(payload, "The appointment could not be updated."),
        );
      }

      onOpenChange(false);
      onSaved({
        message:
          status === "CANCELLED"
            ? "Appointment cancelled."
            : status === "COMPLETED"
              ? "Appointment completed."
              : "Appointment confirmed.",
        startsAt: payload.appointment?.startsAt ?? appointment.startsAt,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The appointment could not be updated.",
      );
    } finally {
      setIsStatusPending(false);
    }
  }

  return (
    <>
      <ScheduleContextFrame
        isDirty={isDirty}
        onRequestClose={requestClose}
        open={open}
        presentation={presentation}
      >
        {(isOverlay) => (
          <>
            {isOverlay ? (
              <DialogHeader className="border-b border-border px-6 py-6 text-left">
                <DialogTitle>
                  {isEditing ? "Appointment details" : "Create appointment"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update appointment details or take the next status action."
                    : "Appointments are created as Scheduled."}
                </DialogDescription>
              </DialogHeader>
            ) : (
              <header className="border-b border-border px-6 py-6">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  {isEditing && appointment
                    ? `${practiceTimeInputValue(new Date(appointment.startsAt))} · ${appointment.patientName}`
                    : "Draft appointment"}
                </p>
                <h2
                  className="mt-2 text-lg font-semibold"
                  id="schedule-context-title"
                  tabIndex={-1}
                >
                  {isEditing ? "Appointment details" : "Create appointment"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isEditing
                    ? "Update appointment details or take the next status action."
                    : "Appointments are created as Scheduled."}
                </p>
              </header>
            )}

            <AppointmentForm
              appointment={appointment}
              dateTimeError={dateTimeError}
              durationError={durationError}
              error={error}
              formId={formId}
              isEditing={isEditing}
              isPending={isPending}
              isStatusPending={isStatusPending}
              onRequestClose={requestClose}
              onSubmit={saveAppointment}
              onUpdateStatus={updateStatus}
              onValueChange={updateValue}
              patients={patients}
              treatments={treatments}
              values={values}
            />
          </>
        )}
      </ScheduleContextFrame>

      <AlertDialog onOpenChange={setIsDiscardOpen} open={isDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved appointment changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="border border-destructive bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setIsDiscardOpen(false);
                onOpenChange(false);
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
