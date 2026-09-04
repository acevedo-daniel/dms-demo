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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Treatment catalog
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
      <header className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Treatment catalog
            </span>
            <span className="font-mono text-xs text-muted-foreground/50">
              /
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Atelier Dental
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl text-foreground">
            Treatments
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Standard practice treatment catalog, clinical categories, and
            default appointment scheduling durations.
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
      <TreatmentCatalog
        initialTreatmentId={parameters.treatment}
        treatments={treatments}
      />
    </main>
  );
}
