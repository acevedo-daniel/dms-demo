import Link from "next/link";
import { NotesIndex } from "@/components/notes-index";
import { Button } from "@/components/ui/button";
import { getNoteComposerOptions, getPatientNotes } from "@/lib/notes";

async function loadNotes() {
  try {
    return await Promise.all([getPatientNotes(), getNoteComposerOptions()]);
  } catch {
    return null;
  }
}

export default async function NotesPage() {
  const data = await loadNotes();

  if (!data) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="notes-error-title"
          className="max-w-lg rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Clinical notes
            </span>
            <span className="font-mono text-xs text-muted-foreground/40">
              /
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Atelier Dental
            </span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="notes-error-title"
          >
            Notes could not be loaded.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The sample clinical notes data is temporarily unavailable. Please
            try again.
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/notes">Try again</Link>
          </Button>
        </section>
      </main>
    );
  }

  const [notes, options] = data;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <NotesIndex
        notes={notes}
        patients={options.patients}
        treatments={options.treatments}
      />
    </main>
  );
}
