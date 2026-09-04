import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
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
                <span className="block text-sm font-semibold tracking-tight text-foreground leading-none">
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
        className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 overflow-hidden"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
        >
          <div className="h-[32rem] w-[56rem] rounded-full bg-gradient-to-b from-primary/[0.05] to-transparent blur-3xl" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column: Credentials & Provisioning */}
          <div className="max-w-xl lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-2xs ring-1 ring-black/[0.03]">
              <span className="size-2 rounded-full bg-accent ring-2 ring-accent/25" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Atelier Dental
              </span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="text-xs text-muted-foreground">
                Practice Workspace
              </span>
              <span aria-hidden className="text-border hidden sm:inline">
                ·
              </span>
              <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                Week 20
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
              No account, password, or personal information is required. Step
              inside a complete fictional practice day and explore the workspace
              freely.
            </p>

            <div className="mt-8">
              <DemoAccessButton />
              <div className="mt-3.5 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span className="font-medium">
                  Instant access · Resettable practice preview · No sign-up
                </span>
              </div>
            </div>

            {/* Practice Session Overview / Credential Pass Card */}
            <div className="mt-10 rounded-[var(--radius-xl)] border border-border/80 bg-surface/80 p-6 sm:p-7 shadow-xs backdrop-blur-xs ring-1 ring-black/[0.03]">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound aria-hidden className="size-4 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Practice Session Overview
                  </p>
                </div>
                <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
                  REF · AT-2026-OP
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2">
                <div className="border-t border-border/60 pt-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Practitioner Role
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    Dr. Jane Smith · Lead
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Practice Date
                  </dt>
                  <dd className="mt-1 font-mono font-medium text-foreground">
                    Tuesday, 12 May 2026
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Workspace Routes
                  </dt>
                  <dd className="mt-1 text-muted-foreground leading-relaxed">
                    Today, Schedule, Patients, Treatments, and Notes.
                  </dd>
                </div>
                <div className="border-t border-border/60 pt-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Workspace Reset
                  </dt>
                  <dd className="mt-1 text-muted-foreground leading-relaxed">
                    Sample data can be restored back to baseline with one click.
                  </dd>
                </div>
              </dl>

              {/* Fast Feature Inclusions */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 font-medium text-foreground/80">
                  <span className="size-1 rounded-full bg-foreground/50" />
                  5-Day Schedule Matrix
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 font-medium text-foreground/80">
                  <span className="size-1 rounded-full bg-foreground/50" />
                  12 Patient Histories
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 font-medium text-foreground/80">
                  <span className="size-1 rounded-full bg-foreground/50" />8
                  Treatment Protocols
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Precision Window Hardware Bezel for Today View */}
          <div className="relative lg:col-span-7">
            <figure className="relative min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-border/90 bg-surface shadow-[0_32px_80px_-16px_rgb(23_23_21_/_0.14)] ring-1 ring-black/[0.04]">
              {/* Precision Window Chrome */}
              <div className="flex items-center justify-between border-b border-border/70 bg-secondary/30 px-3.5 py-2.5 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full border border-border bg-surface" />
                  <span className="size-2 rounded-full border border-border bg-surface" />
                  <span className="size-2 rounded-full border border-border bg-surface" />
                  <span className="ml-1.5 text-xs font-semibold text-foreground">
                    Atelier Dental
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · Today Agenda
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 border border-border/70 text-[11px] font-medium text-foreground">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Live Clinical Workspace
                  </span>
                </div>
              </div>

              {/* Embedded Screenshot with soft border */}
              <div className="p-2 sm:p-3 bg-secondary/10">
                <Image
                  alt="DMS Today view showing the next appointment, a daily agenda, follow-up work, and recent notes for the fictional practice"
                  className="aspect-[4/3] w-full rounded-[var(--radius-lg)] border border-border/80 object-cover object-left-top shadow-xs"
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src={todayScreenshot}
                />
              </div>

              {/* Footer strip */}
              <figcaption className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1.5 border-t border-border/60 bg-surface/95 px-4 py-3 text-xs text-muted-foreground sm:px-5">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <CalendarDays aria-hidden className="size-3.5 text-accent" />
                  <span>Today · Tuesday, 12 May 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Atelier Dental Practice Workspace
                  </span>
                  <span className="hidden sm:inline-flex rounded-full border border-border/70 bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80">
                    Standard Practice Baseline
                  </span>
                </div>
              </figcaption>
            </figure>

            {/* Floating Live Badge: Today's Clinical Morning Focus */}
            <div className="pointer-events-none hidden md:flex absolute -bottom-4 -left-4 z-10 items-center gap-3 rounded-[var(--radius-lg)] border border-border/80 bg-surface/95 p-3.5 shadow-raised backdrop-blur-md">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground/80">
                <Clock3 aria-hidden className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Next: Elena Rostova
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    · 09:30
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Comprehensive Exam · Operatory 1
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
