import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import todayScreenshot from "../../../../docs/screenshots/today.webp";
import { DemoAccessButton } from "@/components/demo-access-button";
import { DmsLogo } from "@/components/dms-logo";
import { StudioControls } from "@/components/studio-controls";
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
    <main className="min-h-screen bg-background">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              href="/"
            >
              <DmsLogo className="size-8 sm:size-9" />
              <div>
                <span className="block text-sm font-bold tracking-tight text-foreground leading-none">
                  DMS
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none">
                  Atelier Dental
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <StudioControls />
            <Link
              className="dms-pressable inline-flex h-9 items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 text-xs font-medium text-muted-foreground shadow-2xs transition-colors hover:bg-secondary/60 hover:text-foreground"
              href="/"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              <span>Back to DMS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Provisioning Surface */}
      <section
        aria-labelledby="demo-access-title"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column: Credentials & Provisioning */}
          <div className="max-w-xl lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-2xs ring-1 ring-black/[0.03]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                Atelier Dental
              </span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Provisioned Access
              </span>
            </div>

            <h1
              className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl sm:leading-[1.05]"
              id="demo-access-title"
              tabIndex={-1}
            >
              Open the DMS demo workspace
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              No account, password, or personal information is required. Open a
              provisioned session and explore a complete fictional practice day.
            </p>

            <div className="mt-8">
              <DemoAccessButton />
              <div className="mt-3.5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span>
                  Zero credentials · Ephemeral clinical session · Auto-resets
                </span>
              </div>
            </div>

            {/* Clinical Specification Matrix */}
            <div className="mt-10 rounded-[var(--radius-lg)] border border-border/80 bg-surface/70 p-5 shadow-xs">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                Provisioned Session Environment
              </p>
              <dl className="mt-4 grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2">
                <div className="border-t border-border/60 pt-3">
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    Practitioner Role
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    Dr. Jane Smith · Lead
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    Practice Baseline
                  </dt>
                  <dd className="mt-1 font-mono text-foreground">
                    Tuesday, 12 May 2026
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    Workspace Routes
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    Today, Schedule, Patients, Treatments, and Notes.
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    Demo Boundary
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    Fictional Atelier Dental data resets to its curated,
                    deterministic baseline.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Precision Window Hardware Bezel for Today View */}
          <figure className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-border/90 bg-surface shadow-[0_32px_80px_-16px_rgb(23_23_21_/_0.14)] ring-1 ring-black/[0.03] lg:col-span-7">
            {/* Precision Window Chrome */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/30 px-3.5 py-2.5 sm:px-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                  atelier-dental.internal / today
                </span>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-block">
                Daily Operations Agenda
              </span>
            </div>
            <div className="p-2 sm:p-3">
              <Image
                alt="DMS Today view showing the next appointment, a daily agenda, follow-up work, and recent notes for the fictional practice"
                className="aspect-[4/3] w-full rounded-[var(--radius-md)] border border-border object-cover object-left-top"
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                src={todayScreenshot}
              />
            </div>
            <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1.5 border-t border-border/60 bg-secondary/15 px-3.5 py-2.5 text-xs text-muted-foreground sm:px-4">
              <span className="font-medium text-foreground">
                Today · Tuesday, 12 May 2026
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Fictional, resettable baseline
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
