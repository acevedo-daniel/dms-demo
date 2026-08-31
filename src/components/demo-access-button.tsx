"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DemoAccessButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function openDemoWorkspace() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/demo/access", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.error ??
            "The demo workspace could not be opened. Try again.",
        );
      }

      router.push("/demo/dashboard");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The demo workspace could not be opened. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full sm:w-auto"
        disabled={isLoading}
        onClick={openDemoWorkspace}
        size="lg"
      >
        {isLoading ? "Opening workspace…" : "Open demo workspace"}
        {!isLoading ? <ArrowRight aria-hidden className="size-4" /> : null}
      </Button>
      <p
        aria-atomic="true"
        aria-live="polite"
        className="min-h-5 text-sm text-destructive"
      >
        {isLoading ? "Opening demo workspace." : error}
      </p>
    </div>
  );
}
