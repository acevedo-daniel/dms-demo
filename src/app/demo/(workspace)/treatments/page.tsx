import Link from "next/link";
import { TreatmentCatalog } from "@/components/treatment-catalog";
import { Button } from "@/components/ui/button";
import { getTreatmentCatalog } from "@/lib/treatments";

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
  const treatments = await loadTreatmentCatalog();
  const parameters = await searchParams;

  if (!treatments) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="treatments-error-title"
          className="max-w-lg rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-8 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-accent">
              Treatment Catalog
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
            id="treatments-error-title"
          >
            The treatment catalog could not be loaded.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The sample catalog data is temporarily unavailable. Please try
            again.
          </p>
          <Button asChild className="mt-6 font-semibold" variant="outline">
            <Link href="/demo/treatments">Try again</Link>
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
              Treatment Catalog
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Atelier Dental</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            Treatments
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Standard clinical protocols, practice specialties, and baseline
            chair allocations for Atelier Dental.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {treatments.length}
            </span>{" "}
            protocols
          </div>
          <div className="rounded-full border border-border/70 bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {uniqueCategories.length}
            </span>{" "}
            specialties
          </div>
        </div>
      </header>

      {/* Clinical Standards Ledger (Editorial, No generic SaaS icons) */}
      <section
        aria-label="Clinical standards overview"
        className="mt-6 grid grid-cols-1 divide-y divide-border/60 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Practice Formulary
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            {treatments.length} Standard Protocols
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Across {uniqueCategories.length} practice specialties
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Chair Allocations
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            30 – 60 Min Blocks
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Baseline chair durations preventing overlap
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Care Coordination
          </p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
            Direct Scheduling
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pre-fills protocol duration into weekly schedule
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
