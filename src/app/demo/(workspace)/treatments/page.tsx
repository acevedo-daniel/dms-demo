import type { Metadata } from "next";
import Link from "next/link";
import { TreatmentCatalog } from "@/components/treatment-catalog";
import { Button } from "@/components/ui/button";
import { getServerTranslations } from "@/lib/i18n/server";
import { getTreatmentCatalog } from "@/lib/treatments";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();

  return {
    title: t.treatments.metaTitle,
    description: t.treatments.metaDescription,
  };
}

async function loadTreatmentCatalog() {
  try {
    return await getTreatmentCatalog();
  } catch {
    return null;
  }
}

type TreatmentsPageProps = {
  searchParams: Promise<{ treatment?: string }>;
};

export default async function TreatmentsPage({
  searchParams,
}: TreatmentsPageProps) {
  const [{ locale, t }, treatments, parameters] = await Promise.all([
    getServerTranslations(),
    loadTreatmentCatalog(),
    searchParams,
  ]);

  if (!treatments) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="treatments-error-title"
          className="max-w-lg rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {locale === "es"
                ? "Catálogo de tratamientos"
                : "Treatment Catalog"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="treatments-error-title"
          >
            {locale === "es"
              ? "No se pudo cargar el catálogo de tratamientos."
              : "Could not load treatment catalog."}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {locale === "es"
              ? "Los datos del catálogo no están disponibles en este momento. Por favor reintentá."
              : "Catalog data is currently unavailable. Please retry."}
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/treatments">
              {locale === "es" ? "Reintentar" : "Retry"}
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const uniqueCategories = [
    ...new Set(treatments.map((treatment) => treatment.category)),
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <header className="flex flex-col gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {locale === "es"
                ? "Catálogo de tratamientos"
                : "Treatment Catalog"}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            {t.treatments.heading}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t.treatments.subheading}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {treatments.length}
            </span>{" "}
            {locale === "es" ? "protocolos" : "protocols"}
          </div>
          <div className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {uniqueCategories.length}
            </span>{" "}
            {locale === "es" ? "especialidades" : "specialties"}
          </div>
        </div>
      </header>

      {/* Clinical Standards Ledger */}
      <section
        aria-label={t.treatments.standardsTitle}
        className="mt-6 grid grid-cols-1 divide-y divide-border/60 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Vademécum clínico" : "Clinical Formulary"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {treatments.length}{" "}
            {locale === "es" ? "protocolos estándar" : "standard protocols"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? `En ${uniqueCategories.length} especialidades odontológicas`
              : `Across ${uniqueCategories.length} dental specialties`}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es" ? "Tiempos de sillón" : "Chair Time"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {t.treatments.standardsLedger.standardDuration}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Duraciones de referencia para evitar superposiciones"
              : "Reference durations to avoid scheduling conflicts"}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "es"
              ? "Coordinación de turnos"
              : "Scheduling Coordination"}
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {locale === "es" ? "Agendamiento directo" : "Direct booking"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {locale === "es"
              ? "Carga automática de duración en la agenda semanal"
              : "Automatic duration filling on weekly schedule"}
          </p>
        </div>
      </section>

      {/* Catalog & Filter View */}
      <TreatmentCatalog
        initialTreatmentId={parameters.treatment}
        treatments={treatments}
      />
    </main>
  );
}
