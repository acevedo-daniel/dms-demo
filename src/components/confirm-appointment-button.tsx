"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";

type ConfirmAppointmentButtonProps = {
  appointmentId: string;
  className?: string;
  patientName: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function ConfirmAppointmentButton({
  appointmentId,
  className,
  patientName,
  size = "sm",
  variant = "outline",
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

      announceWorkspaceFeedback("Appointment confirmed.");
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
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Button
        aria-label={`Confirm appointment for ${patientName}`}
        disabled={isPending}
        onClick={confirmAppointment}
        size={size}
        variant={variant}
      >
        <Check
          aria-hidden
          className={cn(
            "size-3.5",
            variant === "default" ? "text-primary-foreground" : "text-primary",
          )}
        />
        {isPending ? "Confirming…" : "Confirm"}
      </Button>
      {error ? (
        <p className="max-w-48 text-left text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
