import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DemoAccessButton } from "@/components/demo-access-button";
import { DmsLogo } from "@/components/dms-logo";
import { authorizeDemoRequest } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Open demo workspace",
  description: "Open the resettable DMS sample workspace.",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function DemoAccessPage() {
  const authorization = await authorizeDemoRequest(await headers());

  if (authorization.status === "authorized") {
    redirect("/demo/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center bg-background px-4 py-10 sm:px-6">
      <section
        aria-labelledby="demo-access-title"
        className="mx-auto w-full max-w-2xl border-y border-border py-8 sm:py-10"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DmsLogo className="size-9" />
            <span className="text-sm font-semibold tracking-tight">DMS</span>
          </div>
          <Link
            className="dms-pressable inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            href="/"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to case study
          </Link>
        </div>
        <div className="mt-12 max-w-xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            DMS · Atelier Dental
          </p>
          <h1
            className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            id="demo-access-title"
            tabIndex={-1}
          >
            Open the DMS demo workspace
          </h1>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">
            Open a provisioned session for a fictional workspace that resets to
            its curated baseline. No account, password, or personal information
            is requested.
          </p>
          <div className="mt-8">
            <DemoAccessButton />
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          Includes a daily dashboard, weekly schedule, patient records,
          treatment catalog, and operational notes built around one consistent
          workweek.
        </div>
      </section>
    </main>
  );
}
