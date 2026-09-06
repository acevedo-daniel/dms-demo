"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function DemoAccessButton() {
  const router = useRouter();
  const { locale } = useI18n();
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
            (locale === "es"
              ? "No se pudo abrir el espacio de demostración. Reintentá."
              : "Could not open demo workspace. Try again."),
        );
      }

      router.push("/demo/dashboard");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : locale === "es"
            ? "No se pudo abrir el espacio de demostración. Reintentá."
            : "Could not open demo workspace. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        aria-describedby="demo-access-feedback"
        className="w-full sm:w-auto"
        disabled={isLoading}
        onClick={openDemoWorkspace}
        size="lg"
      >
        {isLoading
          ? locale === "es"
            ? "Abriendo espacio…"
            : "Opening workspace…"
          : locale === "es"
            ? "Abrir espacio de demostración"
            : "Open demo workspace"}
        {!isLoading ? <ArrowRight aria-hidden className="size-4" /> : null}
      </Button>
      <p
        aria-atomic="true"
        aria-live="polite"
        className={cn(
          "min-h-5 text-sm",
          error ? "text-destructive" : "text-muted-foreground",
        )}
        id="demo-access-feedback"
      >
        {error}
      </p>
    </div>
  );
}
