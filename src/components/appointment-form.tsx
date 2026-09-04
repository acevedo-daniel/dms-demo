"use client";

import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, Trash2 } from "lucide-react";
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
  StudioDatePicker,
  StudioTimePicker,
} from "@/components/ui/datetime-picker";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect as Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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

  const patientError = error?.toLowerCase().includes("patient") ? error : null;
  const treatmentError = error?.toLowerCase().includes("treatment")
    ? error
    : null;
  const generalError =
    error &&
    !dateTimeError &&
    !durationError &&
    !patientError &&
    !treatmentError
      ? error
      : null;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      id={formId}
      noValidate
      onSubmit={onSubmit}
    >
      <div className="space-y-5 overflow-y-auto px-6 py-6">
        {isEditing && appointment && canManageStatus ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-5">
            {appointment.status === "SCHEDULED" ? (
              <Button
                className="h-8 gap-1.5 border-accent/40 bg-accent-soft text-xs font-semibold text-accent-soft-foreground hover:border-accent hover:bg-accent-soft/80"
                disabled={isStatusPending}
                onClick={() => onUpdateStatus("CONFIRMED")}
                size="sm"
                type="button"
                variant="outline"
              >
                <Check aria-hidden className="size-3.5" />
                Confirm
              </Button>
            ) : null}
            <Button
              className="h-8 gap-1.5 border-success/40 bg-success-soft text-xs font-semibold text-success-foreground hover:border-success hover:bg-success-soft/80"
              disabled={isStatusPending}
              onClick={() => onUpdateStatus("COMPLETED")}
              size="sm"
              type="button"
              variant="outline"
            >
              <CheckCircle2 aria-hidden className="size-3.5" />
              Complete
            </Button>
            <Button asChild className="h-8 text-xs" size="sm" variant="ghost">
              <Link href={`/demo/patients/${appointment.patientId}`}>
                Open patient
              </Link>
            </Button>
          </div>
        ) : null}

        {/* Patient Selection Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${formId}-patient`}>Patient</Label>
            {patientError ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                <AlertCircle aria-hidden className="size-3 shrink-0" />
                Required
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Directory chart
              </span>
            )}
          </div>
          <Select
            aria-describedby={
              patientError ? `${formId}-patient-error` : undefined
            }
            aria-invalid={Boolean(patientError)}
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

        {/* Treatment Protocol Selection Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${formId}-treatment`}>Treatment</Label>
            {treatmentError ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                <AlertCircle aria-hidden className="size-3 shrink-0" />
                Required
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Clinical protocol
              </span>
            )}
          </div>
          <Select
            aria-describedby={
              treatmentError ? `${formId}-treatment-error` : undefined
            }
            aria-invalid={Boolean(treatmentError)}
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
          {treatmentError ? (
            <p
              className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
              id={`${formId}-treatment-error`}
              role="alert"
            >
              <AlertCircle aria-hidden className="size-3.5 shrink-0" />
              {treatmentError}
            </p>
          ) : null}
        </div>

        {/* Studio Date & Time Inputs */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${formId}-date`}>Date</Label>
              {dateTimeError &&
              (dateTimeError.toLowerCase().includes("date") ||
                dateTimeError.toLowerCase().includes("monday")) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                  <AlertCircle aria-hidden className="size-3 shrink-0" />
                  {dateTimeError.includes("Monday")
                    ? "Weekday only"
                    : "Required"}
                </span>
              ) : null}
            </div>
            <StudioDatePicker
              aria-describedby={
                dateTimeError ? `${formId}-date-time-error` : undefined
              }
              aria-invalid={Boolean(dateTimeError)}
              id={`${formId}-date`}
              name="date"
              onChange={(value) => onValueChange("date", value)}
              required
              value={values.date}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${formId}-time`}>Time</Label>
              {dateTimeError &&
              (dateTimeError.toLowerCase().includes("time") ||
                dateTimeError.toLowerCase().includes("slot")) ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                  <AlertCircle aria-hidden className="size-3 shrink-0" />
                  Required
                </span>
              ) : null}
            </div>
            <StudioTimePicker
              aria-describedby={
                dateTimeError ? `${formId}-date-time-error` : undefined
              }
              aria-invalid={Boolean(dateTimeError)}
              id={`${formId}-time`}
              name="time"
              onChange={(value) => onValueChange("time", value)}
              required
              value={values.time}
            />
          </div>
        </div>
        {dateTimeError ? (
          <p
            className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-0.5"
            id={`${formId}-date-time-error`}
            role="alert"
          >
            <AlertCircle aria-hidden className="size-3.5 shrink-0" />
            <span>{dateTimeError}</span>
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

        {/* Duration Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${formId}-duration`}>Duration (minutes)</Label>
            {durationError ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive animate-in fade-in-0 duration-150">
                <AlertCircle aria-hidden className="size-3 shrink-0" />
                15–180 min
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {values.durationMinutes} min
              </span>
            )}
          </div>
          <Input
            aria-describedby={
              durationError ? `${formId}-duration-error` : undefined
            }
            aria-invalid={Boolean(durationError)}
            className="font-mono text-sm tracking-wide"
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
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs font-medium transition-all",
                  values.durationMinutes === String(mins)
                    ? "border-primary/20 bg-primary font-semibold text-primary-foreground shadow-xs"
                    : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-foreground/20 hover:bg-secondary hover:text-foreground",
                )}
                key={mins}
                onClick={() => onValueChange("durationMinutes", String(mins))}
                type="button"
              >
                {mins}m
              </button>
            ))}
          </div>
          {durationError ? (
            <p
              className="flex items-center gap-1.5 text-xs font-medium text-destructive"
              id={`${formId}-duration-error`}
              role="alert"
            >
              <AlertCircle aria-hidden className="size-3.5 shrink-0" />
              {durationError}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Choose 15–180 minutes in 15-minute increments.
          </p>
        </div>

        {/* Operational Note Field */}
        <div className="space-y-2">
          <Label htmlFor={`${formId}-note`}>Operational note</Label>
          <Textarea
            id={`${formId}-note`}
            onChange={(event) => onValueChange("note", event.target.value)}
            placeholder="Optional coordination detail"
            value={values.note}
          />
        </div>

        {generalError ? (
          <div
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
            role="alert"
          >
            <AlertCircle aria-hidden className="size-4 shrink-0" />
            <span>{generalError}</span>
          </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                      <Trash2 aria-hidden className="size-5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Cancel Appointment
                    </span>
                  </div>
                  <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This appointment will be released from the schedule board
                    and permanently preserved in patient history as Cancelled.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel autoFocus>
                    Keep appointment
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
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
