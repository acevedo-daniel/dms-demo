"use client";

import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";

type ArchivePatientButtonProps = {
  isBlocked: boolean;
  patientId: string;
  patientName: string;
};

export function ArchivePatientButton({
  isBlocked,
  patientId,
  patientName,
}: ArchivePatientButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function archivePatient() {
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(`/api/demo/patients/${patientId}/archive`, {
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(
          payload.error?.message ?? "The patient could not be archived.",
        );
      }

      announceWorkspaceFeedback("Patient archived.");
      router.push("/demo/patients");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The patient could not be archived.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isBlocked) {
    return (
      <p className="max-w-sm border-l border-border pl-3 text-sm leading-6 text-muted-foreground">
        Cancel or complete active appointments before archiving this patient.
      </p>
    );
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-10 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive shadow-2xs"
          variant="outline"
        >
          <Archive aria-hidden className="size-4" />
          Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-foreground/80">
              <Archive aria-hidden className="size-4 text-foreground/80" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Archive Patient Chart
            </span>
          </div>
          <AlertDialogTitle>Archive {patientName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action changes the active operational status of this patient
            chart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-[var(--radius-lg)] border border-border/70 bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong className="font-semibold text-foreground">
              Record preservation:
            </strong>{" "}
            {patientName} will be hidden from the active patient directory,
            while all historical appointments, treatment logs, and notes remain
            permanently on file.
          </p>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus>Keep patient active</AlertDialogCancel>
          <Button
            className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
            disabled={isPending}
            onClick={archivePatient}
            type="button"
          >
            {isPending ? "Archiving…" : "Archive patient"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
