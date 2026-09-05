"use client";

import { UserCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";

export function ArriveAppointmentButton({
  appointmentId,
  patientName,
  size = "sm",
}: {
  appointmentId: string;
  patientName: string;
  size?: "sm" | "default";
}) {
  const [pending, setPending] = useState(false);
  async function markArrived() {
    setPending(true);
    try {
      const response = await fetch(`/api/demo/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARRIVED" }),
      });
      if (!response.ok) throw new Error("Unable to update appointment.");
      announceWorkspaceFeedback(`${patientName} marked as arrived.`);
      window.location.reload();
    } catch {
      announceWorkspaceFeedback("Unable to update the appointment.");
      setPending(false);
    }
  }
  return (
    <Button
      aria-label={`Mark ${patientName} as arrived`}
      className={cn("gap-1.5 font-semibold", size === "sm" && "text-xs")}
      disabled={pending}
      onClick={markArrived}
      size={size}
      variant="outline"
    >
      <UserCheck aria-hidden className="size-3.5 text-cyan-600" />
      {pending ? "Updating…" : "Mark arrived"}
    </Button>
  );
}
