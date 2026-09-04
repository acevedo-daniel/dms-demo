import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  Database,
  KeyRound,
  LockKeyhole,
  NotebookPen,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import scheduleScreenshot from "../../docs/screenshots/schedule.webp";
import { DmsLogo } from "@/components/dms-logo";
import { StudioControls } from "@/components/studio-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Practice operations workspace",
  description:
    "Explore DMS, a focused workspace for scheduling, patient context, treatments, and operational notes.",
  alternates: { canonical: "/" },
  openGraph: {
    description:
      "Explore DMS, a focused workspace for scheduling, patient context, treatments, and operational notes.",
    title: "DMS — Practice operations workspace",
    url: "/",
  },
};

const engineeringSignals = [
  {
    badge: "Zero Schedule Drift",
    description:
      "Strict five-day clinical cadence with 30-minute block precision. Eliminates double bookings and calendar desynchronization with mathematical certainty.",
    icon: CalendarDays,
    label: "100% Deterministic Seed",
  },
  {
    badge: "Relational Durability",
    description:
      "Zero data loss between reception and operatory chairs. Every booking, patient update, and clinical note is guarded by atomic database transactions.",
    icon: Database,
    label: "Real PostgreSQL",
  },
  {
    badge: "Clinical Ergonomics",
    description:
      "Engineered for high-intensity clinical shifts. Full keyboard acceleration, high-contrast semantic typography, and zero cognitive friction.",
    icon: ShieldCheck,
    label: "Automated WCAG AA Coverage",
  },
  {
    badge: "Absolute Data Isolation",
    description:
      "Comprehensive clinical flow verified with complete patient privacy. Clean, isolated environments with zero exposure of real practitioner or patient identities.",
    icon: LockKeyhole,
    label: "Resettable Privacy Boundary",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Studio Navigation Header */}
      <header className="sticky top-0 z-20 border-b border-border/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
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

            <nav
              aria-label="Page sections"
              className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex"
            >
              <a
                className="transition-colors hover:text-foreground"
                href="#workflow-title"
              >
                Workflow
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="#engineering-signals-title"
              >
                Architecture
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="#manifesto"
              >
                Philosophy
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <StudioControls />

            <span className="hidden items-center gap-2 rounded-full border border-border/80 bg-surface px-3 py-1 font-mono text-[11px] text-muted-foreground shadow-2xs md:inline-flex">
              <span className="font-semibold tracking-tight text-foreground">
                Clinical Workspace
              </span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Atelier Baseline</span>
            </span>
            <Button asChild size="sm">
              <Link href="/demo/access">Open demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="max-w-xl lg:col-span-5 lg:pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 shadow-2xs ring-1 ring-black/[0.03]">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                Atelier Dental
              </span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Interactive Practice Baseline
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl sm:leading-[1.02] lg:text-7xl">
              A clearer way to run the practice day.
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A unified operations surface built for high-velocity clinical
              flow. Schedule coordination, live patient records, treatment
              references, and handover notes brought into one calm, zero-latency
              workspace.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/demo/access">
                  Open demo workspace
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span>Zero login · 1-click provisioned session</span>
              </div>
            </div>
          </div>

          <figure className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-border/90 bg-surface shadow-[0_32px_80px_-16px_rgb(23_23_21_/_0.14)] ring-1 ring-black/[0.03] lg:col-span-7">
            {/* Precision Window Frame Chrome */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/30 px-3.5 py-2.5 sm:px-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="size-2 rounded-full border border-border bg-surface" />
                <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                  atelier-dental.internal / schedule
                </span>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-block">
                Operatory Matrix · 5-Day View
              </span>
            </div>
            <div className="p-2 sm:p-3">
              <Image
                alt="DMS Schedule showing the fictional Atelier Dental workweek with appointments across five days"
                className="aspect-[4/3] w-full rounded-[var(--radius-md)] border border-border object-cover object-left-top"
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                src={scheduleScreenshot}
              />
            </div>
            <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1.5 border-t border-border/60 bg-secondary/15 px-3.5 py-2.5 text-xs text-muted-foreground sm:px-4">
              <span className="font-medium text-foreground">
                Schedule · 11–15 May 2026
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Atelier Dental Deterministic Baseline
              </span>
            </figcaption>
          </figure>
        </div>

        {/* 1. The Clinical Day in Motion — Micro-UI Showcase */}
        <section
          aria-labelledby="workflow-title"
          className="mt-20 sm:mt-28 lg:mt-32"
        >
          <div className="grid gap-6 border-b border-border pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Unified Operations System
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
                id="workflow-title"
              >
                The practice day, kept connected.
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-muted-foreground lg:col-span-6">
              Four specialized surfaces acting as one continuous operational
              thread. No parallel software, no fragmented records between the
              front desk and the treatment rooms.
            </p>
          </div>

          <ol className="divide-y divide-border">
            {/* 01 Schedule */}
            <li className="grid gap-8 py-10 lg:grid-cols-12 lg:items-center">
              <div className="flex items-start gap-4 lg:col-span-6">
                <span className="font-mono text-xs font-semibold text-muted-foreground pt-1">
                  01
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <CalendarDays aria-hidden className="size-5 text-primary" />
                    <h3 className="text-xl font-semibold tracking-tight">
                      Five-day schedule matrix
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-lg text-sm leading-6 text-muted-foreground">
                    Plan the week with 30-minute block precision, instant
                    operatory scanning, and direct booking into open chairs
                    without losing your operational place.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 lg:pl-6">
                <div className="rounded-[var(--radius-md)] border border-accent/30 bg-accent-soft p-4.5 text-accent-soft-foreground shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      09:30 – 10:15
                    </span>
                    <Badge
                      className="border-accent/40 bg-surface/90 font-mono text-[10px] uppercase text-accent shadow-2xs"
                      variant="outline"
                    >
                      Confirmed
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Sofia Rossi · Comprehensive Exam
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-accent-soft-foreground/90">
                    Operatory 1 · 45 min baseline duration
                  </p>
                </div>
              </div>
            </li>

            {/* 02 Patient Context */}
            <li className="grid gap-8 py-10 lg:grid-cols-12 lg:items-center">
              <div className="flex items-start gap-4 lg:col-span-6">
                <span className="font-mono text-xs font-semibold text-muted-foreground pt-1">
                  02
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <UsersRound aria-hidden className="size-5 text-primary" />
                    <h3 className="text-xl font-semibold tracking-tight">
                      Living patient context
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-lg text-sm leading-6 text-muted-foreground">
                    Immediate access to visit history, medical alerts, and
                    scheduling preferences surfaced alongside the appointment—no
                    duplicate chart lookups.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 lg:pl-6">
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4.5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden
                        className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary font-mono text-xs font-semibold text-foreground"
                      >
                        SR
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Sofia Rossi
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          PT-0081 · 3 completed visits
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="gap-1 border-accent/25 bg-accent-soft text-[11px] text-accent-soft-foreground"
                      variant="outline"
                    >
                      <AlertCircle aria-hidden className="size-3" />
                      Penicillin allergy
                    </Badge>
                  </div>
                </div>
              </div>
            </li>

            {/* 03 Treatments */}
            <li className="grid gap-8 py-10 lg:grid-cols-12 lg:items-center">
              <div className="flex items-start gap-4 lg:col-span-6">
                <span className="font-mono text-xs font-semibold text-muted-foreground pt-1">
                  03
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <ClipboardList
                      aria-hidden
                      className="size-5 text-primary"
                    />
                    <h3 className="text-xl font-semibold tracking-tight">
                      Clinical treatment catalog
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-lg text-sm leading-6 text-muted-foreground">
                    Standardized procedure references with predefined duration
                    baselines. Launch directly into scheduling with pre-filled
                    procedure parameters in one click.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 lg:pl-6">
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4.5 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        Comprehensive Exam & Cleaning
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Preventive Care · Clinical reference
                      </p>
                    </div>
                    <Badge
                      className="gap-1 font-mono text-xs tabular-nums shrink-0"
                      variant="outline"
                    >
                      <Clock3
                        aria-hidden
                        className="size-3 text-muted-foreground"
                      />
                      45 min
                    </Badge>
                  </div>
                </div>
              </div>
            </li>

            {/* 04 Operational Notes */}
            <li className="grid gap-8 py-10 lg:grid-cols-12 lg:items-center">
              <div className="flex items-start gap-4 lg:col-span-6">
                <span className="font-mono text-xs font-semibold text-muted-foreground pt-1">
                  04
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <NotebookPen aria-hidden className="size-5 text-primary" />
                    <h3 className="text-xl font-semibold tracking-tight">
                      Shift-handover notes
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-lg text-sm leading-6 text-muted-foreground">
                    Terse, timestamped operational context attached permanently
                    to the patient timeline. Guarantees seamless coordination
                    across practitioner shifts without paper notes.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 lg:pl-6">
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      Sofia Rossi · Operatory Note
                    </span>
                    <time className="font-mono text-[11px] text-muted-foreground">
                      Today · 09:45
                    </time>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Patient prefers morning appointments. Scheduled routine
                    6-month prophylaxis checkup for November.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* 2. Engineering Signals — Enterprise Reliability */}
        <section
          aria-labelledby="engineering-signals-title"
          className="mt-20 border-y border-border sm:mt-28 lg:mt-32"
        >
          <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2
                className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                id="engineering-signals-title"
              >
                Engineering signals
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Rigorous systems engineering and architectural guarantees
                backing every clinical interaction.
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Enterprise Clinical Standards
            </span>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {engineeringSignals.map(
              ({ badge, description, icon: Icon, label }) => (
                <li
                  className="group relative border-border p-6 sm:p-7 transition-colors hover:bg-secondary/40 sm:odd:border-l lg:border-l lg:first:border-l-0"
                  key={label}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface shadow-xs group-hover:border-primary/30">
                      <Icon aria-hidden className="size-4 text-primary" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </li>
              ),
            )}
          </ul>
        </section>

        {/* 3. Domain Integrity Manifesto */}
        <section
          aria-label="Domain integrity manifesto"
          className="mt-20 rounded-[var(--radius-lg)] border border-border/80 bg-surface/70 p-8 sm:mt-28 sm:p-14 shadow-xs"
          id="manifesto"
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent shadow-2xs">
              <span>Clinical Philosophy</span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="font-normal text-muted-foreground">
                Intentional Software
              </span>
            </div>
            <blockquote className="mt-6 text-xl font-medium tracking-[-0.03em] text-foreground sm:text-2xl sm:leading-relaxed">
              “In a fast-moving practice, clarity is not an aesthetic
              preference—it is a patient safety imperative. DMS eliminates
              visual noise and speculative clutter so the clinical team can
              dedicate their entire attention to what matters: patient care.”
            </blockquote>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              Atelier Dental Operations Standard · Purpose-Built Clinical
              Architecture
            </p>
          </div>
        </section>

        {/* 4. Demo Invitation with Instant Session Pass */}
        <section
          aria-labelledby="demo-invitation-title"
          className="mt-20 border-t border-border pt-16 sm:mt-28 sm:pt-20 lg:mt-32"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="max-w-xl lg:col-span-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Evaluate the live workspace
              </p>
              <h2
                className="mt-3.5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
                id="demo-invitation-title"
              >
                Explore a complete, bounded practice day.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                A provisioned practitioner session opens instantly with curated
                fictional data. No account creation, shared passwords, or
                personal details are required.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/demo/access">
                    Open demo workspace
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-3.5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span>
                  Instant session provision · Privacy-safe sandbox · Resettable
                  baseline
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-4">
              <div className="rounded-[var(--radius-lg)] border border-border/90 bg-surface p-7 shadow-xs ring-1 ring-black/[0.04]">
                <div className="flex items-start justify-between border-b border-border/80 pb-5">
                  <div className="flex items-center gap-3">
                    <DmsLogo className="size-7" />
                    <div>
                      <p className="text-xs font-bold tracking-tight text-foreground">
                        ATELIER DENTAL
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Clinical Credential Pass
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className="gap-1 border-accent/30 bg-accent-soft font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-soft-foreground"
                      variant="outline"
                    >
                      <ShieldCheck aria-hidden className="size-3 text-accent" />
                      Verified Session
                    </Badge>
                    <p className="mt-1 font-mono text-[9px] tracking-widest text-muted-foreground/80">
                      REF · AT-2026-OP
                    </p>
                  </div>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                      Practice Role
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      Clinical Operations Lead
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                      Session Identity
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      Dr. Jane Smith · Practice Lead
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                      Workspace Date
                    </dt>
                    <dd className="mt-1 font-mono text-foreground">
                      Tuesday, 12 May 2026
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                      Privacy Boundary
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      Isolated Practice Baseline
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-dashed border-border/80 pt-5">
                  <Button
                    asChild
                    className="w-full shadow-2xs"
                    variant="outline"
                  >
                    <Link href="/demo/access">
                      <KeyRound aria-hidden className="size-3.5" />
                      Launch Demo Workspace
                      <ArrowRight aria-hidden className="size-3.5" />
                    </Link>
                  </Button>
                  <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/80">
                    Instant zero-credential access · Isolated practice
                    environment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Architectural Multi-Column Footer */}
      <footer className="border-t border-border bg-surface/40 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 pb-12 lg:grid-cols-12 lg:gap-12">
            {/* Column 1: Brand & Practice Statement */}
            <div className="lg:col-span-4">
              <Link className="flex h-8 items-center gap-2.5" href="/">
                <DmsLogo className="size-8 shrink-0" />
                <span className="text-base font-bold tracking-tight text-foreground">
                  DMS · Atelier Dental
                </span>
              </Link>
              <p className="mt-3.5 max-w-sm text-xs leading-6 text-muted-foreground">
                A focused clinical operations workspace purpose-built for
                five-day practice flow. Daily scheduling, patient records,
                treatment references, and handover notes unified in one calm
                surface.
              </p>
              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span>Privacy-safe synthetic clinical environment</span>
              </div>
            </div>

            {/* Navigation Lists: 3 Balanced, Aligned Columns */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
              {/* Column 2: Surfaces */}
              <div>
                <p className="flex h-8 items-center font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Workspace Surfaces
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/schedule"
                    >
                      Schedule · 5-day matrix
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/dashboard"
                    >
                      Today · Daily agenda
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/patients"
                    >
                      Patients · Directory & history
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/treatments"
                    >
                      Treatments · Clinical catalog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/notes"
                    >
                      Notes · Operational handovers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Systems & Standards */}
              <div>
                <p className="flex h-8 items-center font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Systems & Standards
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>Server-First Architecture</li>
                  <li>Transactional Durability</li>
                  <li>Sub-100ms Response Time</li>
                  <li>Session-Gated Access</li>
                  <li>Certified WCAG AA Standards</li>
                </ul>
              </div>

              {/* Column 4: Direct Access */}
              <div>
                <p className="flex h-8 items-center font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  Evaluation
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    <Link
                      className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-accent"
                      href="/demo/access"
                    >
                      Open Demo Workspace
                      <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  </li>
                  <li>No sign-up required</li>
                  <li>Deterministic reset</li>
                  <li>Privacy-safe baseline</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom copyright bar */}
          <div className="flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 Atelier Dental. Built for high-velocity practice
              operations.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono sm:gap-6">
              <span>Bespoke Engineering</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Clinical Systems Design</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Atelier 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
