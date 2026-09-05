import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-background px-4 py-10 sm:px-6">
      <section
        aria-labelledby="not-found-title"
        className="mx-auto w-full max-w-xl rounded-[var(--radius-xl)] border border-border/80 bg-surface/80 p-8 sm:p-12 shadow-xs backdrop-blur-xs ring-1 ring-black/[0.03]"
      >
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary/70 text-foreground/80">
          <SearchX aria-hidden className="size-5" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">
          Atelier Dental
        </p>
        <h1
          className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl"
          id="not-found-title"
        >
          This page is not available.
        </h1>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
          The requested route was not found. Return to DMS home or open the demo
          workspace to continue.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild className="font-semibold shadow-xs">
            <Link href="/demo/access">Open demo workspace</Link>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
            <Link href="/">
              <ArrowLeft aria-hidden className="size-4" />
              Back to DMS
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
