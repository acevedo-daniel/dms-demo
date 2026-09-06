"use client";

import { UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function ArriveAppointmentButton({
  appointmentId,
  patientName,
  size = "sm",
}: {
  appointmentId: string;
  patientName: string;
  size?: "sm" | "default";
}) {
  const router = useRouter();
  const { locale } = useI18n();
  const [pending, setPending] = useState(false);

  async function markArrived() {
    setPending(true);
    try {
      const response = await fetch(`/api/demo/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARRIVED" }),
      });
      if (!response.ok) {
        throw new Error(
          locale === "es"
            ? "No se pudo actualizar el turno."
            : "Could not update appointment.",
        );
      }
      announceWorkspaceFeedback(
        locale === "es"
          ? `${patientName} registrado en recepción.`
          : `${patientName} marked arrived in reception.`,
      );
      router.refresh();
    } catch {
      announceWorkspaceFeedback(
        locale === "es"
          ? "No se pudo actualizar el turno."
          : "Could not update appointment.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      aria-label={
        locale === "es"
          ? `Registrar llegada de ${patientName}`
          : `Mark arrival for ${patientName}`
      }
      className={cn("gap-1.5 font-semibold", size === "sm" && "text-xs")}
      disabled={pending}
      onClick={markArrived}
      size={size}
      variant="outline"
    >
      <UserCheck aria-hidden className="size-3.5 text-info" />
      {pending
        ? locale === "es"
          ? "Actualizando…"
          : "Updating…"
        : locale === "es"
          ? "En recepción"
          : "Arrived"}
    </Button>
  );
}
