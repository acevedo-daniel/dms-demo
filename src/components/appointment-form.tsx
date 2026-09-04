"use client";

import Link from "next/link";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ScheduleAppointment,
  SchedulePatient,
  ScheduleTreatment,
} from "@/lib/schedule-data";

export type AppointmentFormState = {
  date: string;
  durationMinutes: string;
  note: string;
  patientId: string;
  time: string;
  treatmentId: string;
};

export type AppointmentFormProps = {
  appointment?: ScheduleAppointment;
  dateTimeError: string | null;
  durationError: string | null;
  error: string | null;
  formId: string;
  isEditing: boolean;
  isPending: boolean;
  isStatusPending: boolean;
  onRequestClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateStatus: (status: "CONFIRMED" | "COMPLETED" | "CANCELLED") => void;
  onValueChange: (field: keyof AppointmentFormState, value: string) => void;
  patients: SchedulePatient[];
  treatments: ScheduleTreatment[];
  values: AppointmentFormState;
};

export function AppointmentForm({
  appointment,
  dateTimeError,
  durationError,
  error,
  formId,
  isEditing,
  isPending,
  isStatusPending,
  onRequestClose,
  onSubmit,
  onUpdateStatus,
  onValueChange,
  patients,
  treatments,
  values,
}: AppointmentFormProps) {
  const canManageStatus =
    appointment?.status === "SCHEDULED" || appointment?.status === "CONFIRMED";

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      id={formId}
      onSubmit={onSubmit}
    >
      <div className="space-y-5 overflow-y-auto px-6 py-6">
        {isEditing && appointment && canManageStatus ? (
          <div className="flex flex-wrap gap-2 border-b border-border pb-5">
            {appointment.status === "SCHEDULED" ? (
              <Button
                disabled={isStatusPending}
                onClick={() => onUpdateStatus("CONFIRMED")}
                type="button"
                variant="outline"
              >
                <Check aria-hidden className="size-4 text-primary" />
                Confirm
              </Button>
            ) : null}
            <Button
              disabled={isStatusPending}
              onClick={() => onUpdateStatus("COMPLETED")}
              type="button"
              variant="outline"
            >
              <CheckCircle2 aria-hidden className="size-4 text-success" />
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
          <Select
            autoFocus
            id={`${formId}-patient`}
            onChange={(event) => onValueChange("patientId", event.target.value)}
            required
            value={values.patientId}
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} · {patient.identifier}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${formId}-treatment`}>Treatment</Label>
          <Select
            id={`${formId}-treatment`}
            onChange={(event) => {
              const treatment = treatments.find(
                (item) => item.id === event.target.value,
              );
              onValueChange("treatmentId", event.target.value);
              if (treatment) {
                onValueChange(
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
          </Select>
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
              onChange={(event) => onValueChange("date", event.target.value)}
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
              onChange={(event) => onValueChange("time", event.target.value)}
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
            role="alert"
          >
            {dateTimeError}
            {error?.includes("overlaps") ? (
              <button
                className="ml-2 font-medium underline underline-offset-4"
                onClick={onRequestClose}
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
              onValueChange("durationMinutes", event.target.value)
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
              role="alert"
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
            onChange={(event) => onValueChange("note", event.target.value)}
            placeholder="Optional coordination detail"
            value={values.note}
          />
        </div>
        {error && !dateTimeError && !durationError ? (
          <p className="text-sm text-destructive" role="alert">
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
                    className="border border-destructive bg-destructive text-white hover:bg-destructive/90"
                    disabled={isStatusPending}
                    onClick={() => onUpdateStatus("CANCELLED")}
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
        <Button onClick={onRequestClose} type="button" variant="ghost">
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
  );
}
