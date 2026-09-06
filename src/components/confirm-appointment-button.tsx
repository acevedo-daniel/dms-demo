"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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
  const { locale } = useI18n();
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
          payload.error?.message ??
            (locale === "es"
              ? "No se pudo confirmar el turno."
              : "Could not confirm appointment."),
        );
      }

      announceWorkspaceFeedback(
        locale === "es" ? "Turno confirmado." : "Appointment confirmed.",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : locale === "es"
            ? "No se pudo confirmar el turno."
            : "Could not confirm appointment.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Button
        aria-label={
          locale === "es"
            ? `Confirmar turno de ${patientName}`
            : `Confirm appointment for ${patientName}`
        }
        disabled={isPending}
        onClick={confirmAppointment}
        size={size}
        variant={variant}
      >
        <Check
          aria-hidden
          className={cn(
            "size-3.5",
            variant === "default" ? "text-primary-foreground" : "text-accent",
          )}
        />
        {isPending
          ? locale === "es"
            ? "Confirmando…"
            : "Confirming…"
          : locale === "es"
            ? "Confirmar"
            : "Confirm"}
      </Button>
      {error ? (
        <p className="max-w-48 text-left text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
