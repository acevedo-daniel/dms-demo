"use client";

import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { NoteComposer } from "@/components/note-composer";
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
    <NoteComposer
      fixedPatientId={patientId}
      onSaved={() => router.refresh()}
      patients={patients}
      treatments={treatments}
      trigger={
        <Button variant="outline">
          <FilePenLine aria-hidden className="size-4" />
          Add note
        </Button>
      }
    />
  );
}
