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
          className="max-w-lg border-y border-border py-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Treatment catalog
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="treatments-error-title"
          >
            The treatment catalog could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/demo/treatments">Try again</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-7">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Appointment catalog
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
          Treatments
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Available treatments and default appointment durations.
        </p>
      </header>
      <TreatmentCatalog
        initialTreatmentId={parameters.treatment}
        treatments={treatments}
      />
    </main>
  );
}
