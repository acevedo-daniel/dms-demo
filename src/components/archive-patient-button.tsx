"use client";

import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
          className="text-destructive hover:text-destructive"
          variant="ghost"
        >
          <Archive aria-hidden className="size-4" />
          Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive {patientName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the patient from default directory results while
            preserving their record and history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p aria-live="polite" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus>Keep patient active</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={archivePatient}
          >
            {isPending ? "Archiving…" : "Archive patient"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
