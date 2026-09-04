"use client";

import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { NoteComposerPanel } from "@/components/note-composer-panel";
import { Button } from "@/components/ui/button";
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

  return (
    <NoteComposerPanel
      fixedPatientId={patientId}
      onSaved={() => router.refresh()}
      patients={patients}
      treatments={treatments}
      trigger={
        <Button className="h-10 font-semibold shadow-xs" variant="outline">
          <FilePenLine aria-hidden className="size-4" />
          Add note
        </Button>
      }
    />
  );
}
