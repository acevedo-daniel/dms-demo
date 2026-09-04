"use client";

import { RefreshCw } from "lucide-react";
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
        className="max-w-lg border-y border-border py-10"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Atelier Dental
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
          id="workspace-error-title"
        >
          This workspace view could not be loaded.
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          The sample data is temporarily unavailable. Try again to reload this
          workspace view.
        </p>
        <Button className="mt-6" onClick={retry} variant="outline">
          <RefreshCw aria-hidden className="size-4" />
          Try again
        </Button>
      </section>
    </main>
  );
}
