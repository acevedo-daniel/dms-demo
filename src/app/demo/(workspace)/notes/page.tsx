import type { Metadata } from "next";
import Link from "next/link";
import { NotesIndex } from "@/components/notes-index";
import { Button } from "@/components/ui/button";
import { getServerTranslations } from "@/lib/i18n/server";
import { getNoteComposerOptions, getPatientNotes } from "@/lib/notes";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();

  return {
    title: t.notes.metaTitle,
    description: t.notes.metaDescription,
  };
}

async function loadNotes() {
  try {
    return await Promise.all([getPatientNotes(), getNoteComposerOptions()]);
  } catch {
    return null;
  }
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ locale }, parameters, data] = await Promise.all([
    getServerTranslations(),
    searchParams,
    loadNotes(),
  ]);

  if (!data) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="notes-error-title"
          className="max-w-lg rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {locale === "es" ? "Notas clínicas" : "Clinical Notes"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="notes-error-title"
          >
            {locale === "es"
              ? "No se pudieron cargar las notas."
              : "Could not load clinical notes."}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {locale === "es"
              ? "Los datos de notas clínicas no están disponibles en este momento. Por favor reintentá."
              : "Clinical note data is currently unavailable. Please retry."}
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/notes">
              {locale === "es" ? "Reintentar" : "Retry"}
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const [notes, options] = data;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <NotesIndex
        initialCreate={parameters.create === "1"}
        notes={notes}
        patients={options.patients}
        treatments={options.treatments}
      />
    </main>
  );
}
