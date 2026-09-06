"use client";

import Link from "next/link";
import { Clock, FilePenLine, Pencil, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  NoteComposerPanel,
  type SavedPatientNote,
} from "@/components/note-composer-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDemoDate, formatDemoTime } from "@/lib/demo/format";
import { useI18n } from "@/lib/i18n";
import { getLocalizedTreatment } from "@/lib/i18n/treatment-labels";
import { getLocalizedPatientNote } from "@/lib/i18n/demo-content";
import type {
  NoteComposerPatient,
  NoteComposerTreatment,
  PatientNoteItem,
} from "@/lib/notes";

type NotesIndexProps = {
  initialCreate?: boolean;
  notes: PatientNoteItem[];
  patients: NoteComposerPatient[];
  treatments: NoteComposerTreatment[];
};

function patientInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type NoteGroup = {
  id: string;
  label: string;
  notes: PatientNoteItem[];
};

export function NotesIndex({
  initialCreate = false,
  notes,
  patients,
  treatments,
}: NotesIndexProps) {
  const { locale, t } = useI18n();
  const [displayNotes, setDisplayNotes] = useState(notes);
  const [query, setQuery] = useState("");
  const [resultAnnouncement, setResultAnnouncement] = useState("");
  const pendingFocusNoteId = useRef<string | null>(null);
  const previousResultCount = useRef(notes.length);

  const localizedTreatments = useMemo(() => {
    return treatments.map((treatment) =>
      getLocalizedTreatment(treatment, locale),
    );
  }, [treatments, locale]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredNotes = useMemo(() => {
    if (!normalizedQuery) {
      return displayNotes;
    }

    return displayNotes.filter((note) =>
      `${note.patientName} ${note.treatmentName ?? ""} ${getLocalizedPatientNote(note.id, note.body, locale)}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [displayNotes, locale, normalizedQuery]);

  const noteGroups = useMemo(() => {
    return filteredNotes.reduce<NoteGroup[]>((groups, note) => {
      const label = formatDemoDate(new Date(note.createdAt), locale);
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
  }, [filteredNotes, locale]);

  const uniquePatientsCount = useMemo(() => {
    return new Set(displayNotes.map((n) => n.patientId)).size;
  }, [displayNotes]);

  const uniqueTreatmentsCount = useMemo(() => {
    return new Set(displayNotes.map((n) => n.treatmentId).filter(Boolean)).size;
  }, [displayNotes]);

  useEffect(() => {
    if (pendingFocusNoteId.current) {
      const noteElement = document.getElementById(
        `note-${pendingFocusNoteId.current}`,
      );
      if (noteElement) {
        noteElement.focus();
        noteElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      pendingFocusNoteId.current = null;
    }
  }, [displayNotes]);

  useEffect(() => {
    if (filteredNotes.length !== previousResultCount.current) {
      const label = `${filteredNotes.length} ${
        filteredNotes.length === 1
          ? locale === "es"
            ? "nota encontrada"
            : "note found"
          : locale === "es"
            ? "notas encontradas"
            : "notes found"
      }`;
      setResultAnnouncement(label);
      previousResultCount.current = filteredNotes.length;
    }
  }, [filteredNotes.length, locale]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        const target = event.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        event.preventDefault();
        document.getElementById("notes-search")?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleSaved(savedNote: SavedPatientNote) {
    const patient = patients.find(
      (candidate) => candidate.id === savedNote.patientId,
    );
    const treatment = localizedTreatments.find(
      (candidate) => candidate.id === savedNote.treatmentId,
    );

    const isNewNote = !displayNotes.some((note) => note.id === savedNote.id);

    setDisplayNotes((current) => [
      {
        ...savedNote,
        patientName:
          patient?.name ?? (locale === "es" ? "Paciente" : "Patient"),
        treatmentName: treatment?.name ?? null,
      },
      ...current.filter((note) => note.id !== savedNote.id),
    ]);
    if (isNewNote) {
      pendingFocusNoteId.current = savedNote.id;
    }
  }

  function resultLabel(count: number) {
    return `${count} ${count === 1 ? (locale === "es" ? "nota" : "note") : locale === "es" ? "notas" : "notes"}`;
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {t.notes.handoverLedger}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-medium text-foreground">Atelier Dental</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground">
            {t.notes.heading}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {t.notes.subheading}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-border/70 bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-2xs">
              <span className="font-semibold text-foreground">
                {displayNotes.length}
              </span>{" "}
              {displayNotes.length === 1
                ? locale === "es"
                  ? "nota"
                  : "note"
                : locale === "es"
                  ? "notas"
                  : "notes"}
            </div>
            <div className="rounded-full border border-border/70 bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-2xs">
              <span className="font-semibold text-foreground">
                {uniquePatientsCount}
              </span>{" "}
              {uniquePatientsCount === 1
                ? locale === "es"
                  ? "paciente"
                  : "patient"
                : locale === "es"
                  ? "pacientes"
                  : "patients"}
            </div>
            <div className="hidden sm:block rounded-full border border-border/70 bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-2xs">
              <span className="font-semibold text-foreground">
                {uniqueTreatmentsCount}
              </span>{" "}
              {uniqueTreatmentsCount === 1
                ? locale === "es"
                  ? "protocolo"
                  : "protocol"
                : locale === "es"
                  ? "protocolos"
                  : "protocols"}
            </div>
          </div>
          <NoteComposerPanel
            defaultOpen={initialCreate}
            onSaved={handleSaved}
            patients={patients}
            treatments={localizedTreatments}
            trigger={
              <Button className="h-10 px-4 font-semibold shadow-xs">
                <FilePenLine aria-hidden className="size-4" />
                {t.notes.newNote}
              </Button>
            }
          />
        </div>
      </header>

      {/* Search Bar */}
      <div className="mt-8 max-w-2xl">
        <div className="flex items-center justify-between gap-2">
          <label
            className="text-sm font-semibold text-foreground"
            htmlFor="notes-search"
          >
            {locale === "es" ? "Buscar notas" : "Search notes"}
          </label>
          <span
            className="text-xs text-muted-foreground font-medium"
            id="notes-result-count"
          >
            {resultLabel(filteredNotes.length)}
          </span>
        </div>
        <div className="relative mt-2">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-describedby="notes-result-count"
            className="h-11 rounded-[var(--radius-md)] border-border/80 bg-background/60 pl-10 pr-20 text-sm shadow-xs backdrop-blur-xs transition-all focus:border-foreground/30 focus:bg-background"
            id="notes-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.notes.searchPlaceholder}
            value={query}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1.5">
            {query ? (
              <Button
                aria-label={
                  locale === "es"
                    ? "Limpiar búsqueda de notas"
                    : "Clear notes search"
                }
                className="size-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden className="size-3.5" />
              </Button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/70 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </div>
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {resultAnnouncement}
        </p>
      </div>

      {filteredNotes.length ? (
        <div className="mt-8 space-y-10">
          {noteGroups.map((group) => (
            <section aria-labelledby={group.id} key={group.id}>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/80" />
                <h2
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  id={group.id}
                >
                  {group.label}
                </h2>
                <div className="h-px flex-1 bg-border/80" />
              </div>

              <ol className="mt-4 space-y-4">
                {group.notes.map((note) => {
                  const localizedTreatment = note.treatmentName
                    ? getLocalizedTreatment(
                        {
                          id: note.treatmentId ?? undefined,
                          name: note.treatmentName,
                        },
                        locale,
                      )
                    : null;

                  return (
                    <li
                      className="group rounded-[var(--radius-xl)] border border-border/80 bg-card/40 p-5 sm:p-6 transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      id={`note-${note.id}`}
                      key={note.id}
                      tabIndex={-1}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-start gap-3.5">
                          <div
                            aria-hidden
                            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-xs font-semibold text-foreground/80"
                          >
                            {patientInitials(note.patientName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                              <Link
                                aria-label={
                                  locale === "es"
                                    ? `Ver ficha de ${note.patientName}`
                                    : `View record for ${note.patientName}`
                                }
                                className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary"
                                href={`/demo/patients/${note.patientId}`}
                              >
                                {note.patientName}
                              </Link>

                              {localizedTreatment && note.treatmentId ? (
                                <Link
                                  className="inline-flex items-center rounded border border-border/70 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
                                  href={`/demo/treatments?treatment=${note.treatmentId}`}
                                >
                                  <span>{localizedTreatment.name}</span>
                                </Link>
                              ) : null}

                              <time
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                                dateTime={note.createdAt}
                              >
                                <Clock
                                  aria-hidden
                                  className="size-3 text-muted-foreground/60"
                                />
                                {formatDemoTime(
                                  new Date(note.createdAt),
                                  locale,
                                )}
                              </time>
                            </div>

                            <div className="mt-3 text-sm leading-relaxed text-foreground/90">
                              <p className="whitespace-pre-wrap">
                                {getLocalizedPatientNote(
                                  note.id,
                                  note.body,
                                  locale,
                                )}
                              </p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                              <span>
                                {locale === "es"
                                  ? "Registrado por Dra. Jane Smith · Odontóloga Responsable"
                                  : "Recorded by Dr. Jane Smith · Lead Dentist"}
                              </span>
                              <span className="font-medium text-foreground/70 flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-foreground/40" />
                                {locale === "es"
                                  ? "Registro verificado"
                                  : "Verified record"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 self-end sm:self-start">
                          <NoteComposerPanel
                            note={note}
                            onSaved={handleSaved}
                            patients={patients}
                            treatments={localizedTreatments}
                            trigger={
                              <Button
                                aria-label={
                                  locale === "es"
                                    ? `Editar nota de ${note.patientName}`
                                    : `Edit note for ${note.patientName}`
                                }
                                className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                                size="sm"
                                variant="ghost"
                              >
                                <Pencil aria-hidden className="size-3.5" />
                                {locale === "es" ? "Editar" : "Edit"}
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      ) : query ? (
        <section
          aria-labelledby="no-note-results-title"
          className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h2
            className="text-base font-semibold text-foreground"
            id="no-note-results-title"
          >
            {locale === "es"
              ? "Ninguna nota coincide con esta búsqueda."
              : "No notes matched this search."}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "es"
              ? "Probá buscando por otro paciente, protocolo o contenido de la nota."
              : "Try searching by another patient, treatment, or note text."}
          </p>
          <Button
            className="mt-4"
            onClick={() => setQuery("")}
            variant="outline"
          >
            {locale === "es" ? "Limpiar búsqueda" : "Clear search"}
          </Button>
        </section>
      ) : (
        <section
          aria-labelledby="no-notes-title"
          className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h2
            className="text-base font-semibold text-foreground"
            id="no-notes-title"
          >
            {t.notes.emptyTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.notes.emptyDesc}
          </p>
        </section>
      )}
    </div>
  );
}
