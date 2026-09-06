"use client";

import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { NoteComposerPanel } from "@/components/note-composer-panel";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { NoteComposerPatient, NoteComposerTreatment } from "@/lib/notes";

type PatientNoteActionProps = {
  patientId: string;
  patients: NoteComposerPatient[];
  treatments: NoteComposerTreatment[];
};

export function PatientNoteAction({
  patientId,
  patients,
  treatments,
}: PatientNoteActionProps) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <NoteComposerPanel
      fixedPatientId={patientId}
      onSaved={() => router.refresh()}
      patients={patients}
      treatments={treatments}
      trigger={
        <Button className="h-10 font-semibold shadow-xs" variant="outline">
          <FilePenLine aria-hidden className="size-4" />
          {t.patients.record.newNoteAction}
        </Button>
      }
    />
  );
}
