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
          className="max-w-lg border-y border-border py-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Patient notes
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="notes-error-title"
          >
            Patient notes could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again.
          </p>
          <Button asChild className="mt-6" variant="outline">
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
