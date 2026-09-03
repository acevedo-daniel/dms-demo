"use client";

import Link from "next/link";
import { FilePenLine, Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  NoteComposer,
  type SavedPatientNote,
} from "@/components/note-composer";
import { Button } from "@/components/ui/button";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import type {
  NoteComposerPatient,
  NoteComposerTreatment,
  PatientNoteItem,
} from "@/lib/notes";

type NotesIndexProps = {
  notes: PatientNoteItem[];
  patients: NoteComposerPatient[];
  treatments: NoteComposerTreatment[];
};

function dateLabel(date: string) {
  return formatDemoDate(new Date(date));
}

type NoteGroup = {
  id: string;
  label: string;
  notes: PatientNoteItem[];
};

export function NotesIndex({ notes, patients, treatments }: NotesIndexProps) {
  const [displayNotes, setDisplayNotes] = useState(notes);
  const pendingFocusNoteId = useRef<string | null>(null);
  const noteGroups = useMemo(() => {
    return displayNotes.reduce<NoteGroup[]>((groups, note) => {
      const label = dateLabel(note.createdAt);
      const currentGroup = groups.at(-1);

      if (currentGroup?.label === label) {
        currentGroup.notes.push(note);
        return groups;
      }

      groups.push({
        id: `notes-date-${note.createdAt.slice(0, 10)}`,
        label,
        notes: [note],
      });
      return groups;
    }, []);
  }, [displayNotes]);

  useEffect(() => {
    const noteId = pendingFocusNoteId.current;

    if (!noteId) {
      return;
    }

    document.getElementById(`note-${noteId}`)?.focus();
    pendingFocusNoteId.current = null;
  }, [displayNotes]);

  function handleSaved(savedNote: SavedPatientNote) {
    const patient = patients.find(
      (candidate) => candidate.id === savedNote.patientId,
    );
    const treatment = treatments.find(
      (candidate) => candidate.id === savedNote.treatmentId,
    );

    const isNewNote = !displayNotes.some((note) => note.id === savedNote.id);

    setDisplayNotes((current) => [
      {
        ...savedNote,
        patientName: patient?.name ?? "Patient",
        treatmentName: treatment?.name ?? null,
      },
      ...current.filter((note) => note.id !== savedNote.id),
    ]);
    if (isNewNote) {
      pendingFocusNoteId.current = savedNote.id;
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Operational annotations
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
            Patient notes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {displayNotes.length} {displayNotes.length === 1 ? "note" : "notes"}{" "}
            in this workspace
          </p>
        </div>
        <NoteComposer
          onSaved={handleSaved}
          patients={patients}
          treatments={treatments}
          trigger={
            <Button>
              <FilePenLine aria-hidden className="size-4" />
              Add note
            </Button>
          }
        />
      </header>
      {displayNotes.length ? (
        <div className="mt-8 border-y border-border">
          {noteGroups.map((group) => (
            <section
              aria-labelledby={group.id}
              className="border-b border-border py-5 last:border-b-0"
              key={group.id}
            >
              <h2
                className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
                id={group.id}
              >
                {group.label}
              </h2>
              <ol className="mt-3 divide-y divide-border">
                {group.notes.map((note) => (
                  <li
                    className="py-5 first:pt-0 last:pb-0"
                    id={`note-${note.id}`}
                    key={note.id}
                    tabIndex={-1}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                          <Link
                            aria-label={`Open patient record for ${note.patientName}`}
                            className="font-medium text-foreground hover:text-primary"
                            href={`/demo/patients/${note.patientId}`}
                          >
                            {note.patientName}
                          </Link>
                          {note.treatmentName ? (
                            <span className="text-muted-foreground">
                              · {note.treatmentName}
                            </span>
                          ) : null}
                        </div>
                        <time
                          className="mt-2 block font-mono text-xs text-muted-foreground"
                          dateTime={note.createdAt}
                        >
                          {formatDemoTime(new Date(note.createdAt))}
                        </time>
                        <p className="mt-3 max-w-3xl text-sm leading-6">
                          {note.body}
                        </p>
                      </div>
                      <NoteComposer
                        note={note}
                        onSaved={handleSaved}
                        patients={patients}
                        treatments={treatments}
                        trigger={
                          <Button
                            aria-label={`Edit note for ${note.patientName}`}
                            variant="ghost"
                          >
                            <Pencil aria-hidden className="size-4" />
                            Edit
                          </Button>
                        }
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <section className="mt-8 border-y border-border py-12 text-center">
          <p className="font-medium">No patient notes have been recorded.</p>
        </section>
      )}
    </div>
  );
}
