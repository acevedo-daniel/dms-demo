"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ConfirmAppointmentButtonProps = {
  appointmentId: string;
  patientName: string;
};

export function ConfirmAppointmentButton({
  appointmentId,
  patientName,
}: ConfirmAppointmentButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function confirmAppointment() {
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(`/api/demo/appointments/${appointmentId}`, {
        body: JSON.stringify({ status: "CONFIRMED" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(
          payload.error?.message ?? "Appointment could not be confirmed.",
        );
      }

      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Appointment could not be confirmed.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        aria-label={`Confirm appointment for ${patientName}`}
        disabled={isPending}
        onClick={confirmAppointment}
        size="sm"
        variant="outline"
      >
        <Check aria-hidden className="size-4 text-primary" />
        {isPending ? "Confirming…" : "Confirm"}
      </Button>
      {error ? (
        <p
          aria-live="polite"
          className="max-w-48 text-right text-xs text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
