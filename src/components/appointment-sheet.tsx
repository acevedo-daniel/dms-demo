"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Check, CheckCircle2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type AppointmentSheetProps = {
  appointment?: ScheduleAppointment;
  initialPatientId?: string;
  initialStartsAt?: string;
  onOpenChange: (open: boolean) => void;
  onSaved: (message: string) => void;
  open: boolean;
  patients: SchedulePatient[];
  treatments: ScheduleTreatment[];
};

type AppointmentFormState = {
  date: string;
  durationMinutes: string;
  note: string;
  patientId: string;
  time: string;
  treatmentId: string;
};

function initialValues({
  appointment,
  initialPatientId,
  initialStartsAt,
  treatments,
}: Pick<
  AppointmentSheetProps,
  "appointment" | "initialPatientId" | "initialStartsAt" | "treatments"
>): AppointmentFormState {
  const startsAt = new Date(
    initialStartsAt ?? appointment?.startsAt ?? "2026-05-12T12:00:00.000Z",
  );
  const treatment = treatments.find(
    (item) => item.id === appointment?.treatmentId,
  );

  return {
    date: practiceDateInputValue(startsAt),
    durationMinutes: String(
      appointment?.durationMinutes ?? treatment?.defaultDurationMinutes ?? 30,
    ),
    note: appointment?.note ?? "",
    patientId: appointment?.patientId ?? initialPatientId ?? "",
    time: practiceTimeInputValue(startsAt),
    treatmentId: appointment?.treatmentId ?? "",
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

export function AppointmentSheet({
  appointment,
  initialPatientId,
  initialStartsAt,
  onOpenChange,
  onSaved,
  open,
  patients,
  treatments,
}: AppointmentSheetProps) {
  const formId = useId();
  const isEditing = Boolean(appointment);
  const [values, setValues] = useState(() =>
    initialValues({
      appointment,
      initialPatientId,
      initialStartsAt,
      treatments,
    }),
  );
  const [initialFormValues, setInitialFormValues] = useState(values);
  const [error, setError] = useState<string | null>(null);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isStatusPending, setIsStatusPending] = useState(false);
  const canManageStatus =
    appointment?.status === "SCHEDULED" || appointment?.status === "CONFIRMED";
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialFormValues);
  const dateTimeError =
    error &&
    /(overlaps|Monday through Friday|30-minute slot|fit within)/i.test(error)
      ? error
      : null;
  const durationError =
    error && /duration/i.test(error) && !dateTimeError ? error : null;

  function updateValue(field: keyof AppointmentFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
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
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          getServerError(payload, "The appointment could not be saved."),
        );
      }

      setInitialFormValues(values);
      onOpenChange(false);
      onSaved(isEditing ? "Appointment updated." : "Appointment created.");
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
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error(
          getServerError(payload, "The appointment could not be updated."),
        );
      }

      onOpenChange(false);
      onSaved(
        status === "CANCELLED"
          ? "Appointment cancelled."
          : status === "COMPLETED"
            ? "Appointment completed."
            : "Appointment confirmed.",
      );
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
      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            requestClose();
          }
        }}
        open={open}
      >
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
              {isEditing ? "Appointment details" : "Create appointment"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update appointment details or take the next status action."
                : "Appointments are created as Scheduled."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex min-h-0 flex-1 flex-col"
            id={formId}
            onSubmit={saveAppointment}
          >
            <div className="space-y-5 overflow-y-auto px-6 py-6">
              {isEditing && appointment && canManageStatus ? (
                <div className="flex flex-wrap gap-2 border-b border-border pb-5">
                  {appointment.status === "SCHEDULED" ? (
                    <Button
                      disabled={isStatusPending}
                      onClick={() => updateStatus("CONFIRMED")}
                      type="button"
                      variant="outline"
                    >
                      <Check aria-hidden className="size-4 text-primary" />
                      Confirm
                    </Button>
                  ) : null}
                  <Button
                    disabled={isStatusPending}
                    onClick={() => updateStatus("COMPLETED")}
                    type="button"
                    variant="outline"
                  >
                    <CheckCircle2
                      aria-hidden
                      className="size-4 text-[#166534]"
                    />
                    Complete
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/demo/patients/${appointment.patientId}`}>
                      Open patient
                    </Link>
                  </Button>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor={`${formId}-patient`}>Patient</Label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
                      {patient.name} · {patient.identifier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-treatment`}>Treatment</Label>
                <select
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  id={`${formId}-treatment`}
                  onChange={(event) => {
                    const treatment = treatments.find(
                      (item) => item.id === event.target.value,
                    );
                    updateValue("treatmentId", event.target.value);
                    if (treatment) {
                      updateValue(
                        "durationMinutes",
                        String(treatment.defaultDurationMinutes),
                      );
                    }
                  }}
                  required
                  value={values.treatmentId}
                >
                  <option value="">Select treatment</option>
                  {treatments.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                      {treatment.name} · {treatment.defaultDurationMinutes} min
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-date`}>Date</Label>
                  <Input
                    aria-describedby={
                      dateTimeError ? `${formId}-date-time-error` : undefined
                    }
                    aria-invalid={Boolean(dateTimeError)}
                    id={`${formId}-date`}
                    onChange={(event) =>
                      updateValue("date", event.target.value)
                    }
                    required
                    type="date"
                    value={values.date}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-time`}>Time</Label>
                  <Input
                    aria-describedby={
                      dateTimeError ? `${formId}-date-time-error` : undefined
                    }
                    aria-invalid={Boolean(dateTimeError)}
                    id={`${formId}-time`}
                    onChange={(event) =>
                      updateValue("time", event.target.value)
                    }
                    required
                    step="1800"
                    type="time"
                    value={values.time}
                  />
                </div>
              </div>
              {dateTimeError ? (
                <p
                  className="text-sm text-destructive"
                  id={`${formId}-date-time-error`}
                >
                  {dateTimeError}
                  {error?.includes("overlaps") ? (
                    <button
                      className="ml-2 font-medium underline underline-offset-4"
                      onClick={() => onOpenChange(false)}
                      type="button"
                    >
                      Return to schedule
                    </button>
                  ) : null}
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor={`${formId}-duration`}>Duration (minutes)</Label>
                <Input
                  aria-describedby={
                    durationError ? `${formId}-duration-error` : undefined
                  }
                  aria-invalid={Boolean(durationError)}
                  id={`${formId}-duration`}
                  max="180"
                  min="15"
                  onChange={(event) =>
                    updateValue("durationMinutes", event.target.value)
                  }
                  required
                  step="15"
                  type="number"
                  value={values.durationMinutes}
                />
                {durationError ? (
                  <p
                    className="text-sm text-destructive"
                    id={`${formId}-duration-error`}
                  >
                    {durationError}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Choose 15–180 minutes in 15-minute increments.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-note`}>Operational note</Label>
                <Textarea
                  id={`${formId}-note`}
                  onChange={(event) => updateValue("note", event.target.value)}
                  placeholder="Optional coordination detail"
                  value={values.note}
                />
              </div>
              {error && !dateTimeError && !durationError ? (
                <p aria-live="polite" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {isEditing && appointment && canManageStatus ? (
                <div className="border-t border-border pt-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="text-destructive hover:text-destructive"
                        disabled={isStatusPending}
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 aria-hidden className="size-4" />
                        Cancel appointment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This appointment will remain in patient history as
                          Cancelled.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel autoFocus>
                          Keep appointment
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => updateStatus("CANCELLED")}
                        >
                          Cancel appointment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : null}
            </div>
            <DialogFooter className="mt-auto border-t border-border px-6 py-4 sm:justify-between">
              <Button onClick={requestClose} type="button" variant="ghost">
                Close
              </Button>
              <Button disabled={isPending || isStatusPending} type="submit">
                {isPending
                  ? "Saving…"
                  : isEditing
                    ? "Save changes"
                    : "Create appointment"}
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
              Your unsaved appointment changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
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
