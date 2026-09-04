import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-background px-4 py-10 sm:px-6">
      <section
        aria-labelledby="not-found-title"
        className="mx-auto w-full max-w-xl border-y border-border py-10 sm:border sm:bg-card sm:p-10"
      >
        <SearchX aria-hidden className="size-5 text-primary" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
          Atelier Dental
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
          id="not-found-title"
        >
          This page is not available.
        </h1>
        <p className="mt-3 max-w-md leading-7 text-muted-foreground">
          Return to the case study or open the demo workspace to continue.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/demo/access">Open demo workspace</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft aria-hidden className="size-4" />
              Back to case study
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
