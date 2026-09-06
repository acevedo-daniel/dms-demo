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
import { useI18n } from "@/lib/i18n";

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
  const { locale, t } = useI18n();
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
          payload.error?.message ??
            (locale === "es"
              ? "No se pudo archivar la ficha del paciente."
              : "Could not archive patient record."),
        );
      }

      announceWorkspaceFeedback(
        locale === "es"
          ? "Ficha de paciente archivada."
          : "Patient record archived.",
      );
      router.push("/demo/patients");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : locale === "es"
            ? "No se pudo archivar la ficha del paciente."
            : "Could not archive patient record.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (isBlocked) {
    return (
      <p className="max-w-sm border-l border-border pl-3 text-sm leading-6 text-muted-foreground">
        {t.patients.record.archiveWarningActiveAppts}
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
          {t.patients.record.archivePatient}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-foreground/80">
              <Archive aria-hidden className="size-4 text-foreground/80" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {locale === "es"
                ? "Archivar ficha de paciente"
                : "Archive patient record"}
            </span>
          </div>
          <AlertDialogTitle>
            {locale === "es"
              ? `¿Archivar a ${patientName}?`
              : `Archive ${patientName}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.patients.record.archiveConfirmDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-[var(--radius-lg)] border border-border/70 bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong className="font-semibold text-foreground">
              {locale === "es"
                ? "Preservación del historial clínico:"
                : "Clinical history preservation:"}
            </strong>{" "}
            {locale === "es"
              ? `${patientName} dejará de mostrarse en el padrón activo del directorio, pero todos sus turnos, protocolos realizados y notas permanecerán guardados como historial médico de la clínica.`
              : `${patientName} will no longer appear in active directory filters, but all visits, protocols, and notes will remain securely stored as clinical history.`}
          </p>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel autoFocus>
            {locale === "es" ? "Mantener paciente activo" : "Keep active"}
          </AlertDialogCancel>
          <Button
            className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
            disabled={isPending}
            onClick={archivePatient}
            type="button"
          >
            {isPending
              ? t.patients.record.archiving
              : t.patients.record.archiveConfirmAction}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
