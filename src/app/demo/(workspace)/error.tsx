"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type WorkspaceErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function WorkspaceError({ retry }: WorkspaceErrorProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <section
        aria-labelledby="workspace-error-title"
        className="max-w-lg rounded-[var(--radius-xl)] border border-border/80 bg-surface/80 p-8 sm:p-10 shadow-xs backdrop-blur-xs ring-1 ring-black/[0.03]"
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle aria-hidden className="size-5" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">
          Atelier Dental
        </p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          id="workspace-error-title"
        >
          This workspace view could not be loaded.
        </h1>
        <p className="mt-3 leading-relaxed text-sm text-muted-foreground">
          The sample data is temporarily unavailable. Try again to reload this
          workspace view.
        </p>
        <Button
          className="mt-6 font-semibold shadow-xs"
          onClick={retry}
          variant="outline"
        >
          <RefreshCw aria-hidden className="size-4" />
          Try again
        </Button>
      </section>
    </main>
  );
}
