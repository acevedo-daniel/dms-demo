import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import todayScreenshot from "../../../../docs/screenshots/today.webp";
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
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <section
        aria-labelledby="demo-access-title"
        className="mx-auto w-full max-w-7xl"
      >
        <div className="flex h-12 items-center justify-between gap-4 border-b border-border">
          <div className="flex items-center gap-3">
            <DmsLogo className="size-9" />
            <span className="text-sm font-semibold tracking-tight">DMS</span>
          </div>
          <Link
            className="dms-pressable inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            href="/"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to DMS
          </Link>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
          <div className="max-w-xl lg:col-span-5">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              DMS · Atelier Dental
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl sm:leading-[1.05]"
              id="demo-access-title"
              tabIndex={-1}
            >
              Open the DMS demo workspace
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
              No account, password, or personal information is required. Open a
              provisioned session and explore a complete fictional practice day.
            </p>
            <div className="mt-8">
              <DemoAccessButton />
            </div>
            <dl className="mt-10 divide-y divide-border border-y border-border text-sm">
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                <dt className="font-medium">Workspace routes</dt>
                <dd className="text-muted-foreground">
                  Today, Schedule, Patients, Treatments, and Notes.
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                <dt className="font-medium">Demo boundary</dt>
                <dd className="text-muted-foreground">
                  Fictional Atelier Dental data resets to its curated,
                  deterministic baseline.
                </dd>
              </div>
            </dl>
          </div>

          <figure className="min-w-0 rounded-[var(--radius-lg)] border border-border bg-card p-2 shadow-[0_24px_64px_-12px_rgb(23_23_21_/_0.16)] ring-1 ring-black/[0.04] sm:p-3 lg:col-span-7">
            <Image
              alt="DMS Today view showing the next appointment, a daily agenda, follow-up work, and recent notes for the fictional practice"
              className="aspect-[4/3] w-full rounded-[var(--radius-md)] border border-border object-cover object-left-top"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              src={todayScreenshot}
            />
            <figcaption className="px-1 pt-3 text-sm text-muted-foreground">
              Today · Tuesday, 12 May 2026 · Fictional, resettable baseline
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
