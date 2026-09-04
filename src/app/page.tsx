import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
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
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";
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
    badge: "Practice Synchronization",
    description:
      "A calm five-day clinical rhythm with 30-minute block clarity. Eliminates double bookings and chair desynchronization effortlessly.",
    icon: CalendarDays,
    label: "Synchronized schedule",
    spec: "12 patients · 8 treatments · 5-day cycle",
  },
  {
    badge: "Clinical Record Durability",
    description:
      "Instant consistency between reception and treatment operatories. Every appointment, status change, and clinical note is securely preserved.",
    icon: Database,
    label: "Relational integrity",
    spec: "Unified ledger · Immediate record synchronization",
  },
  {
    badge: "High-Contrast Ergonomics",
    description:
      "Engineered for high-intensity clinical focus. Natural navigation, high-contrast typography, and zero cognitive friction.",
    icon: ShieldCheck,
    label: "Accessible by design",
    spec: "Clinical readability & tactile keyboard control",
  },
  {
    badge: "Confidential Practice Sandbox",
    description:
      "A complete practice operations preview with total patient privacy. Clean, isolated environments with zero exposure of real personal data.",
    icon: LockKeyhole,
    label: "Protected workspace",
    spec: "Fictional Atelier cohort · Zero personal exposure",
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
                <span className="block text-sm font-semibold tracking-tight text-foreground leading-none">
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

      {/* Hero Section — The Apple Dynamic Studio Stage */}
      <section
        aria-labelledby="hero-title"
        className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8 lg:pt-28 lg:pb-36"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
        >
          <div className="h-[32rem] w-[56rem] rounded-full bg-gradient-to-b from-primary/[0.05] to-transparent blur-3xl" />
        </div>

        {/* Hero Header Area: Centered, Prestigious, Airy */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-4 py-1.5 shadow-2xs backdrop-blur-xs ring-1 ring-black/[0.03]">
            <span className="size-2 rounded-full bg-accent ring-2 ring-accent/25" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Atelier Dental
            </span>
            <span aria-hidden className="text-border">
              /
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Practice Operations
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              Week of 11–15 May 2026
            </span>
          </div>

          <h1
            className="mt-8 text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl sm:leading-[1.05] lg:text-7xl"
            id="hero-title"
          >
            A clearer way to run the practice day.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
            A unified operations surface built for high-velocity clinical flow.
            Schedule coordination, live patient records, treatment references,
            and handover notes brought into one calm, zero-latency workspace.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              asChild
              className="h-12 px-7 text-sm font-semibold shadow-xs"
              size="lg"
            >
              <Link href="/demo/access">
                Open demo workspace
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck
                aria-hidden
                className="size-4 text-accent shrink-0"
              />
              <span className="font-medium">
                Instant preview · No password required
              </span>
            </div>
          </div>
        </div>

        {/* The Dynamic Studio Stage Frame with Layered Floating Cards */}
        <div className="relative mx-auto mt-14 max-w-6xl sm:mt-18 lg:mt-20">
          {/* Main Stage Window Frame */}
          <figure className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border/90 bg-surface/90 shadow-[0_32px_80px_-16px_rgb(23_23_21_/_0.12)] ring-1 ring-black/[0.04]">
            {/* Precision macOS/Atelier Window Chrome */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/30 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full border border-border bg-surface" />
                <span className="size-2.5 rounded-full border border-border bg-surface" />
                <span className="size-2.5 rounded-full border border-border bg-surface" />
                <div className="ml-2 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Atelier Dental
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · Weekly Agenda
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 border border-border/70 text-[11px] font-medium">
                  <span className="size-1.5 rounded-full bg-accent" />
                  Chair Operations · 5-Day View
                </span>
              </div>
            </div>

            {/* Embedded Live Preview Image */}
            <div className="relative p-2 sm:p-3 bg-secondary/10">
              <Image
                alt="DMS Schedule showing the fictional Atelier Dental workweek with appointments across five days"
                className="aspect-[16/10] w-full rounded-[var(--radius-lg)] border border-border/80 object-cover object-left-top shadow-inner"
                priority
                sizes="(min-width: 1280px) 1152px, (min-width: 1024px) 90vw, 100vw"
                src={scheduleScreenshot}
              />
            </div>

            {/* Stage Footer Status Strip */}
            <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/60 bg-surface/90 px-4 py-3 text-xs text-muted-foreground sm:px-5">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <CalendarDays
                  aria-hidden
                  className="size-3.5 text-muted-foreground"
                />
                <span>Schedule · 11–15 May 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Atelier Dental Practice Workspace
                </span>
                <span className="hidden md:inline-flex rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 text-[10px] font-medium text-foreground/80">
                  Continuous Practice Flow
                </span>
              </div>
            </figcaption>
          </figure>

          {/* Floating Live Card: Up Next (Top Right) */}
          <div className="pointer-events-none hidden md:flex absolute -top-5 -right-3 lg:-right-5 z-10 items-center gap-3 rounded-[var(--radius-lg)] border border-border/80 bg-surface/95 p-3.5 shadow-raised backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground/80">
              <span>ER</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Elena Rostova
                </span>
                <AppointmentStatusBadge status="CONFIRMED" />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Comprehensive Exam · 09:30 · Operatory 1
              </p>
            </div>
          </div>

          {/* Floating Live Card: Shift Handover (Bottom Left) */}
          <div className="pointer-events-none hidden md:flex absolute -bottom-5 -left-3 lg:-left-5 z-10 items-center gap-3 rounded-[var(--radius-lg)] border border-border/80 bg-surface/95 p-3.5 shadow-raised backdrop-blur-md">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground/80">
              <NotebookPen aria-hidden className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Clinical Handover Note
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Today · 09:45
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs truncate">
                Dr. Jane Smith: Routine prophylaxis checkup confirmed
              </p>
            </div>
          </div>
        </div>

        {/* Value Metrics Band Grounding Section 1 */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 border-t border-border/70 pt-10">
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              30m
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              Precision Schedule Blocks
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Aligned with standard clinical pacing
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              0
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              Chair Conflicts or Overlaps
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Guaranteed double-booking prevention
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              100%
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              Preserved Clinical Context
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              All history and alerts bound permanently
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              Continuous
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              Clinical Practice Flow
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Zero friction between reception and operatories
            </p>
          </div>
        </div>
      </section>

      {/* 1. The Clinical Day in Motion — 4-Pillar Bento Grid */}
      <section
        aria-labelledby="workflow-title"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36 border-t border-border"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Unified Operations System
          </p>
          <h2
            className="mt-3.5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
            id="workflow-title"
          >
            The practice day, kept connected.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Four specialized surfaces acting as one continuous operational
            thread. No parallel software, no fragmented records between the
            front desk and the treatment operatories.
          </p>
        </div>

        {/* Expansive Apple Bento Grid */}
        <div className="mt-14 sm:mt-18 grid gap-6 lg:grid-cols-12">
          {/* Bento Card 1: 5-Day Schedule Matrix (Hero Card, Span 7) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <CalendarDays aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  01 · Schedule
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Five-day clinical agenda
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                Plan the week with 30-minute block precision, instant operatory
                scanning, and direct booking into open chairs without losing
                your operational place.
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-accent" />
                  <span className="text-xs font-semibold text-foreground">
                    Operatory 1 · Morning Session
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Tuesday, 12 May
                </span>
              </div>
              <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-secondary/30 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    09:30 – 10:15
                  </span>
                  <AppointmentStatusBadge status="CONFIRMED" />
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Sofia Rossi · Comprehensive Exam
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Operatory 1 · 45 min baseline duration
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>Operatory chair coordination</span>
                <span className="font-mono text-foreground font-medium">
                  30m grid resolution
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Living Patient Context (Span 5) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <UsersRound aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  02 · Patients
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Living patient context
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Immediate access to visit history, medical alerts, and
                scheduling preferences surfaced alongside the appointment.
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center gap-3.5">
                <div
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground/80"
                >
                  SR
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Sofia Rossi
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    PT-0081 · 3 completed visits
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/60">
                <Badge
                  className="gap-1.5 border-border/80 bg-secondary/50 text-xs font-medium text-foreground/80"
                  variant="outline"
                >
                  <span className="size-1.5 rounded-full bg-amber-600/80" />
                  Penicillin allergy
                </Badge>
                <Badge className="text-xs font-medium" variant="secondary">
                  Prefers morning visits
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>Direct clinical timeline</span>
                <span className="text-foreground/80 font-medium">
                  History preserved
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Clinical Treatment Catalog (Span 5) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <ClipboardList aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  03 · Protocols
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Clinical treatment catalog
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Standardized procedure references with predefined duration
                baselines. Launch directly into scheduling with pre-filled
                parameters.
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Comprehensive Exam & Cleaning
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Preventive Care · Clinical Protocol
                  </p>
                </div>
                <Badge
                  className="gap-1.5 text-xs font-medium tabular-nums shrink-0"
                  variant="outline"
                >
                  <Clock3
                    aria-hidden
                    className="size-3 text-muted-foreground"
                  />
                  45 min
                </Badge>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 text-xs font-medium text-muted-foreground flex items-center gap-1">
                <span>Pre-fills booking duration automatically</span>
                <ArrowRight aria-hidden className="size-3 text-foreground/60" />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                <span>Atelier Standard Protocols</span>
                <span className="font-mono text-foreground font-medium">
                  8 catalog items
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Shift-Handover Notes (Hero Card, Span 7) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <NotebookPen aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  04 · Handover
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Shift-handover notes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                Terse, timestamped operational context attached permanently to
                the patient timeline. Guarantees seamless coordination across
                practitioner shifts without paper notes.
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Sofia Rossi · Operatory Handover
                </span>
                <time className="text-xs text-muted-foreground">
                  Today · 09:45
                </time>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                Patient prefers morning appointments. Scheduled routine 6-month
                prophylaxis checkup for November. All restorative charting
                verified.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <span className="text-[11px]">Logged by Dr. Jane Smith</span>
                <span className="text-[11px] font-medium text-foreground/70 flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-foreground/40" />
                  Verified session entry
                </span>
              </div>
            </div>
          </div>

          {/* Operational Continuity Rail (Spans all 12 columns) */}
          <div className="lg:col-span-12 rounded-[var(--radius-xl)] border border-border/70 bg-surface/60 p-6 sm:p-8 backdrop-blur-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Connected Clinical Journey · A Typical Morning at Atelier
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                4 Operational Touchpoints · Zero Fragmented Records
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    1
                  </span>
                  <span>Intake & Identification</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Patient arrives at reception. Identity confirmed, Penicillin
                  allergy alert surfaced immediately.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    2
                  </span>
                  <span>Chair Allocation</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Operatory 1 assigned for 09:30. 45-minute block locked on
                  5-day schedule with zero overlap risk.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    3
                  </span>
                  <span>Protocol Guidance</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Comprehensive Exam protocol baseline pre-fills procedure
                  duration and standard clinical milestones.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    4
                  </span>
                  <span>Handover & Next Visit</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Shift-handover note logged chairside. 6-month recall scheduled
                  before patient leaves reception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Engineering Signals — Enterprise Reliability */}
      <section
        aria-labelledby="engineering-signals-title"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36 border-t border-border"
      >
        <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2
              className="text-xs font-semibold uppercase tracking-wider text-primary"
              id="engineering-signals-title"
            >
              Engineering signals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rigorous systems engineering and architectural guarantees backing
              every clinical interaction.
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Enterprise Clinical Standards
          </span>
        </div>

        <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {engineeringSignals.map(
            ({ badge, description, icon: Icon, label, spec }) => (
              <li
                className="group relative flex flex-col justify-between rounded-[var(--radius-xl)] border border-border/80 bg-surface/70 p-6 sm:p-7 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:bg-surface/90"
                key={label}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface shadow-xs">
                      <Icon aria-hidden className="size-5 text-foreground/80" />
                    </div>
                    <Badge
                      className="border-border/80 bg-secondary/50 text-[11px] font-medium text-foreground/85"
                      variant="outline"
                    >
                      {badge}
                    </Badge>
                  </div>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                    {label}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {spec}
                  </span>
                </div>
              </li>
            ),
          )}
        </ul>

        {/* Engineering Architecture Guarantee Strip */}
        <div className="mt-10 rounded-[var(--radius-lg)] border border-border/70 bg-surface/50 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Next.js 16 App Router
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Server Components by default
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Tailwind CSS v4
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Inline tokens, zero runtime CSS
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                TypeScript Strict
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                End-to-end schema validation
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Playwright E2E Suite
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Multi-viewport responsive verified
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Domain Integrity Manifesto */}
      <section
        aria-label="Domain integrity manifesto"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36 border-t border-border"
        id="manifesto"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3.5 py-1 text-xs font-medium text-accent shadow-2xs">
            <span className="font-semibold">Practice Manifesto</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="text-muted-foreground">Clinical Philosophy</span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            Software designed to disappear into patient care.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A clinical operations platform should demand no more cognitive
            attention than the instruments on the operatory tray.
          </p>
        </div>

        {/* Centerpiece Quote Card */}
        <div className="mx-auto mt-12 max-w-4xl rounded-[var(--radius-xl)] border border-border/80 bg-surface/80 p-8 sm:p-14 shadow-xs">
          <blockquote className="text-xl font-medium tracking-[-0.03em] text-foreground sm:text-2xl sm:leading-relaxed text-center">
            “In a fast-moving practice, clarity is not an aesthetic
            preference—it is a patient safety imperative. DMS eliminates visual
            noise and speculative clutter so the clinical team can dedicate
            their entire attention to what matters: patient care.”
          </blockquote>
          <div className="mt-8 flex flex-col items-center justify-center border-t border-border/70 pt-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              Dr. Jane Smith
            </p>
            <p className="text-xs text-muted-foreground">
              Clinical Operations Lead · Atelier Dental
            </p>
            <span className="mt-2 rounded-full bg-secondary/80 px-3 py-1 font-mono text-[10px] text-muted-foreground">
              Atelier Dental Operations Standard · Purpose-Built Clinical
              Architecture
            </span>
          </div>
        </div>

        {/* 3 Core Practice Tenets */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              01 · Serene Ergonomics
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              Calm interfaces
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              High-intensity treatment operatories require serenity. Zero pop-up
              notifications, zero advertising clutter, and zero hidden menus.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              02 · Temporal Rhythm
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              Structured cadence
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Designed around realistic 30-minute pacing intervals that respect
              chair turnover, sterilization routines, and patient consultation.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              03 · Radical Reliability
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              Relational lockstep
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Instant transactional persistence with relational database
              guarantees, keeping reception and operatory staff in continuous
              synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Demo Invitation with Instant Session Pass */}
      <section
        aria-labelledby="demo-invitation-title"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36 border-t border-border"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="max-w-xl lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
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
              fictional data. No account creation, shared passwords, or personal
              details are required.
            </p>

            {/* Sandbox Features Checklist */}
            <div className="mt-6 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  Five-day multi-operatory schedule with live appointments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  Twelve patient records with medical alerts and visit histories
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  Standardized clinical treatment catalog with duration presets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  Chronological shift-handover notes with clinician attribution
                </span>
              </div>
            </div>

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
                    <p className="text-xs font-semibold tracking-tight text-foreground">
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
                <Button asChild className="w-full shadow-2xs" variant="outline">
                  <Link href="/demo/access">
                    <KeyRound aria-hidden className="size-3.5" />
                    Launch Demo Workspace
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </Button>
                <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/80">
                  Instant zero-credential access · Isolated practice environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Multi-Column Footer */}
      <footer className="border-t border-border bg-surface/40 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 pb-12 lg:grid-cols-12 lg:gap-12">
            {/* Column 1: Brand & Practice Statement */}
            <div className="lg:col-span-4">
              <Link className="flex h-8 items-center gap-2.5" href="/">
                <DmsLogo className="size-8 shrink-0" />
                <span className="text-base font-semibold tracking-tight text-foreground">
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
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
                  Workspace Surfaces
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/schedule"
                    >
                      Schedule · 5-day agenda
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
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
                  Systems & Standards
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>Fast, Server-Rendered UI</li>
                  <li>Conflict-Free Scheduling</li>
                  <li>Instant Response Times</li>
                  <li>Isolated Demo Sessions</li>
                  <li>Full WCAG AA Accessibility</li>
                </ul>
              </div>

              {/* Column 4: Direct Access */}
              <div>
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
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
                  <li>One-click practice reset</li>
                  <li>Zero real patient data</li>
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
