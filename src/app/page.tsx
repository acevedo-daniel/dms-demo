import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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
import { getServerTranslations } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getServerTranslations();

  return {
    title: { absolute: t.landing.metaTitle },
    description: t.landing.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      description: t.landing.metaDescription,
      locale: locale === "es" ? "es_AR" : "en_US",
      siteName: "DMS",
      title: t.landing.metaTitle,
      type: "website",
      url: "/",
    },
  };
}

const engineeringSignals = (locale: Locale) =>
  locale === "es"
    ? [
        {
          badge: "Sincronización clínica",
          description:
            "Un ritmo clínico semanal ordenado en bloques de 30 minutos. Evita superposiciones y desajustes de sillón con total claridad.",
          icon: CalendarDays,
          label: "Agenda sincronizada",
          spec: "16 pacientes · 8 tratamientos · ciclo de 5 días",
        },
        {
          badge: "Solidez del registro clínico",
          description:
            "Consistencia inmediata entre la recepción y los sillones de atención. Cada turno, cambio de estado y nota clínica queda preservado de forma segura.",
          icon: Database,
          label: "Integridad relacional",
          spec: "Registro unificado · Sincronización inmediata",
        },
        {
          badge: "Ergonomía de alto contraste",
          description:
            "Diseñado para el ritmo intenso de la práctica clínica. Navegación fluida, tipografía de alto contraste y control completo por teclado.",
          icon: ShieldCheck,
          label: "Accesible por diseño",
          spec: "Legibilidad clínica y control ágil por teclado",
        },
        {
          badge: "Demostración clínica confidencial",
          description:
            "Exploración operativa completa con resguardo total de la privacidad. Datos de muestra aislados sin exposición de información real.",
          icon: LockKeyhole,
          label: "Espacio protegido",
          spec: "Cohorte ficticia de Atelier · Sin datos personales reales",
        },
      ]
    : [
        {
          badge: "Clinical synchronization",
          description:
            "A weekly clinical rhythm arranged in 30-minute blocks. Prevents operatory overlaps and schedule drift with clear visibility.",
          icon: CalendarDays,
          label: "Synchronized schedule",
          spec: "16 patients · 8 treatments · 5-day cycle",
        },
        {
          badge: "Clinical record strength",
          description:
            "Immediate consistency between reception and operatories. Every appointment, status change, and clinical note is safely preserved.",
          icon: Database,
          label: "Relational integrity",
          spec: "Unified record · Immediate synchronization",
        },
        {
          badge: "High-contrast ergonomics",
          description:
            "Designed for the pace of clinical practice. Fluid navigation, high-contrast typography, and complete keyboard control.",
          icon: ShieldCheck,
          label: "Accessible by design",
          spec: "Clinical legibility · Fast keyboard control",
        },
        {
          badge: "Confidential clinical demo",
          description:
            "A complete operational walkthrough with privacy bounded by design. Sample data is isolated and never represents real people.",
          icon: LockKeyhole,
          label: "Protected workspace",
          spec: "Fictional Atelier cohort · No real personal data",
        },
      ];

export default async function Home() {
  const { locale, t } = await getServerTranslations();
  const landing = t.landing;

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
              aria-label={
                locale === "es" ? "Secciones de la página" : "Page sections"
              }
              className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex"
            >
              <a
                className="transition-colors hover:text-foreground"
                href="#workflow-title"
              >
                {landing.navWorkflow}
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="#engineering-signals-title"
              >
                {landing.navArchitecture}
              </a>
              <a
                className="transition-colors hover:text-foreground"
                href="#manifesto"
              >
                {landing.navPhilosophy}
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <StudioControls />

            <span className="hidden items-center gap-2 rounded-full border border-border/80 bg-surface px-3 py-1 font-mono text-[11px] text-muted-foreground shadow-2xs md:inline-flex">
              <span className="font-semibold tracking-tight text-foreground">
                {locale === "es" ? "Espacio clínico" : "Clinical Space"}
              </span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>
                {locale === "es" ? "Entorno Atelier" : "Atelier Environment"}
              </span>
            </span>
            <Button asChild size="sm">
              <Link href="/demo/access">{landing.enterDemo}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              {locale === "es" ? "Operatoria clínica" : "Clinical operatory"}
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              {locale === "es"
                ? "Semana del 11 al 15 de mayo de 2026"
                : "Week of May 11–15, 2026"}
            </span>
          </div>

          <h1
            className="mt-8 text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl sm:leading-[1.05] lg:text-7xl"
            id="hero-title"
          >
            {landing.heroTitle}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
            {landing.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              asChild
              className="h-12 px-7 text-sm font-semibold shadow-xs"
              size="lg"
            >
              <Link href="/demo/access">
                {landing.openDemoCta}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck
                aria-hidden
                className="size-4 text-accent shrink-0"
              />
              <span className="font-medium">
                {locale === "es"
                  ? "Acceso inmediato · Sin contraseñas requeridas"
                  : "Instant access · No password required"}
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
                    · {locale === "es" ? "Agenda semanal" : "Weekly schedule"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 border border-border/70 text-[11px] font-medium">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {locale === "es"
                    ? "Atención en sillones · Vista de 5 días"
                    : "Operatory care · 5-day view"}
                </span>
              </div>
            </div>

            {/* Embedded Live Preview Image */}
            <div className="relative p-2 sm:p-3 bg-secondary/10">
              <Image
                alt={
                  locale === "es"
                    ? "Agenda de DMS con la semana de trabajo de Atelier Dental y turnos distribuidos en cinco días"
                    : "DMS schedule showing Atelier Dental appointments across a five-day work week"
                }
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
                <span>
                  {locale === "es"
                    ? "Agenda · 11 al 15 de mayo de 2026"
                    : "Schedule · May 11–15, 2026"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {locale === "es"
                    ? "Espacio de trabajo Atelier Dental"
                    : "Atelier Dental workspace"}
                </span>
                <span className="hidden md:inline-flex rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 text-[10px] font-medium text-foreground/80">
                  {locale === "es"
                    ? "Continuidad operativa en clínica"
                    : "Clinical operational continuity"}
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
                {locale === "es"
                  ? "Examen integral · 09:30 · Sillón 1"
                  : "Comprehensive exam · 09:30 · Operatory 1"}
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
                  {locale === "es"
                    ? "Nota de pase de guardia"
                    : "Handover note"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {locale === "es" ? "Hoy · 09:45" : "Today · 09:45"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs truncate">
                {locale === "es"
                  ? "Dra. Jane Smith: Control de profilaxis de rutina confirmado"
                  : "Dr. Jane Smith: Routine prophylaxis follow-up confirmed"}
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
              {locale === "es"
                ? "Bloques de agenda precisos"
                : "Precise schedule blocks"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {locale === "es"
                ? "Alineados con el ritmo clínico habitual"
                : "Aligned with the usual clinical rhythm"}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              0
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              {locale === "es"
                ? "Conflictos o solapamientos de sillón"
                : "Operatory conflicts or overlaps"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {locale === "es"
                ? "Prevención garantizada de dobles reservas"
                : "Double bookings prevented by design"}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              100%
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              {locale === "es"
                ? "Contexto clínico preservado"
                : "Clinical context preserved"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {locale === "es"
                ? "Historial y alertas vinculados de forma permanente"
                : "History and alerts remain linked"}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/60 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">
              {locale === "es" ? "Continuo" : "Continuous"}
            </p>
            <p className="mt-1 text-xs font-medium text-foreground">
              {locale === "es"
                ? "Ritmo de trabajo clínico"
                : "Clinical workflow rhythm"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {locale === "es"
                ? "Transición fluida entre recepción y gabinetes"
                : "A smooth handoff between reception and operatories"}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {landing.previewBadge}
          </p>
          <h2
            className="mt-3.5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
            id="workflow-title"
          >
            {landing.featuresHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {landing.featuresSubheading}
          </p>
        </div>

        {/* Expansive Bento Grid */}
        <div className="mt-14 sm:mt-18 grid gap-6 lg:grid-cols-12">
          {/* Bento Card 1: 5-Day Schedule Matrix */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <CalendarDays aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  01 · {locale === "es" ? "Agenda" : "Schedule"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {landing.features.scheduleTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                {landing.features.scheduleDesc}
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-accent" />
                  <span className="text-xs font-semibold text-foreground">
                    {locale === "es"
                      ? "Sillón 1 · Turno mañana"
                      : "Operatory 1 · Morning"}
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {locale === "es" ? "Martes, 12 de mayo" : "Tuesday, May 12"}
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
                  {locale === "es"
                    ? "Sofia Rossi · Examen integral"
                    : "Sofia Rossi · Comprehensive exam"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {locale === "es"
                    ? "Sillón 1 · 45 min de duración base"
                    : "Operatory 1 · 45 min baseline duration"}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>
                  {locale === "es"
                    ? "Coordinación de sillones de atención"
                    : "Operatory coordination"}
                </span>
                <span className="font-mono text-foreground font-medium">
                  {locale === "es"
                    ? "Resolución de grilla en 30 min"
                    : "30-minute grid resolution"}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Living Patient Context */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <UsersRound aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  02 · {locale === "es" ? "Pacientes" : "Patients"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {landing.features.integrityTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {landing.features.integrityDesc}
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
                    {locale === "es"
                      ? "PT-0081 · 3 visitas registradas"
                      : "PT-0081 · 3 recorded visits"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/60">
                <Badge
                  className="gap-1.5 border-border/80 bg-secondary/50 text-xs font-medium text-foreground/80"
                  variant="outline"
                >
                  <span className="size-1.5 rounded-full bg-warning" />
                  {locale === "es"
                    ? "Alergia a la penicilina"
                    : "Penicillin allergy"}
                </Badge>
                <Badge className="text-xs font-medium" variant="secondary">
                  {locale === "es"
                    ? "Prefiere turnos por la mañana"
                    : "Prefers morning appointments"}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>
                  {locale === "es"
                    ? "Línea de tiempo clínica directa"
                    : "Direct clinical timeline"}
                </span>
                <span className="text-foreground/80 font-medium">
                  {locale === "es"
                    ? "Historial preservado"
                    : "History preserved"}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Clinical Treatment Catalog */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <ClipboardList aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  03 · {locale === "es" ? "Protocolos" : "Protocols"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {landing.features.accessibleTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {landing.features.accessibleDesc}
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {locale === "es"
                      ? "Examen integral y limpieza"
                      : "Comprehensive exam and cleaning"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {locale === "es"
                      ? "Atención preventiva · Protocolo clínico"
                      : "Preventive care · Clinical protocol"}
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
                <span>
                  {locale === "es"
                    ? "Precarga la duración del turno automáticamente"
                    : "Automatically preloads appointment duration"}
                </span>
                <ArrowRight aria-hidden className="size-3 text-foreground/60" />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
                <span>
                  {locale === "es"
                    ? "Protocolos estándar de Atelier"
                    : "Atelier standard protocols"}
                </span>
                <span className="font-mono text-foreground font-medium">
                  8 procedimientos catalogados
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Shift-Handover Notes */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-7 sm:p-9 shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-sm lg:col-span-7">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/75 shadow-2xs">
                  <NotebookPen aria-hidden className="size-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  04 · {locale === "es" ? "Guardia" : "Handover"}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {landing.features.protectedTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                {landing.features.protectedDesc}
              </p>
            </div>

            {/* Rich Visual Mockup Component */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-border/70 bg-surface/90 p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  {locale === "es"
                    ? "Sofia Rossi · Pase en sillón"
                    : "Sofia Rossi · Operatory handover"}
                </span>
                <time className="text-xs text-muted-foreground">
                  {locale === "es" ? "Hoy · 09:45" : "Today · 09:45"}
                </time>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                {locale === "es"
                  ? "La paciente prefiere turnos por la mañana. Se agendó control semestral de profilaxis para noviembre. Se verificó el odontograma de restauraciones."
                  : "The patient prefers morning appointments. A six-month prophylaxis follow-up was scheduled for November. The restoration chart was verified."}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <span className="text-[11px]">
                  {locale === "es"
                    ? "Registrado por Dra. Jane Smith"
                    : "Recorded by Dr. Jane Smith"}
                </span>
                <span className="text-[11px] font-medium text-foreground/70 flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-foreground/40" />
                  {locale === "es"
                    ? "Entrada de sesión verificada"
                    : "Verified session entry"}
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
                  {locale === "es"
                    ? "Recorrido clínico coordinado · Una mañana habitual en Atelier"
                    : "Coordinated clinical journey · A typical morning at Atelier"}
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {locale === "es"
                  ? "4 etapas operativas · Sin registros fragmentados"
                  : "4 operational steps · No fragmented records"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    1
                  </span>
                  <span>
                    {locale === "es"
                      ? "Recepción e identificación"
                      : "Reception and identification"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {locale === "es"
                    ? "La paciente llega a recepción. Se confirma su identidad y se visualiza de inmediato la alerta por alergia a la penicilina."
                    : "The patient arrives at reception. Her identity is confirmed and the penicillin allergy alert is immediately visible."}
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    2
                  </span>
                  <span>
                    {locale === "es"
                      ? "Asignación de sillón"
                      : "Operatory assignment"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {locale === "es"
                    ? "Se asigna el Sillón 1 a las 09:30. Bloque de 45 minutos reservado en la agenda semanal sin riesgo de superposición."
                    : "Operatory 1 is assigned at 09:30. A 45-minute block is reserved in the weekly schedule without overlap risk."}
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    3
                  </span>
                  <span>
                    {locale === "es"
                      ? "Guía por protocolo"
                      : "Protocol guidance"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {locale === "es"
                    ? "El protocolo de examen integral precarga los tiempos y parámetros habituales del procedimiento."
                    : "The comprehensive exam protocol preloads the procedure's usual timing and parameters."}
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-[10px] text-foreground/80">
                    4
                  </span>
                  <span>
                    {locale === "es"
                      ? "Pase de guardia y próximo turno"
                      : "Handover and next appointment"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {locale === "es"
                    ? "Se asienta la nota clínica al pie del sillón. El turno de control a los 6 meses queda agendado antes de que la paciente deje recepción."
                    : "The clinical note is recorded at the operatory. The six-month follow-up is scheduled before the patient leaves reception."}
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
              className="text-xs font-semibold uppercase tracking-wider text-accent"
              id="engineering-signals-title"
            >
              {landing.architectureLabel}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {landing.architectureDescription}
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {landing.professionalStandards}
          </span>
        </div>

        <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {engineeringSignals(locale).map(
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
                {locale === "es"
                  ? "Server Components por diseño"
                  : "Server Components by design"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Tailwind CSS v4
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {locale === "es"
                  ? "Tokens sin sobrecarga en runtime"
                  : "Runtime-light design tokens"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {locale === "es" ? "TypeScript estricto" : "Strict TypeScript"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {locale === "es"
                  ? "Validación de esquemas de punta a punta"
                  : "End-to-end schema validation"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Playwright E2E Suite
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {locale === "es"
                  ? "Cobertura responsive multidispositivo"
                  : "Cross-device responsive coverage"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Domain Integrity Manifesto */}
      <section
        aria-label={`${landing.manifestoLabel} y ${landing.philosophyLabel}`}
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-36 border-t border-border"
        id="manifesto"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3.5 py-1 text-xs font-medium text-accent shadow-2xs">
            <span className="font-semibold">{landing.manifestoLabel}</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span className="text-muted-foreground">
              {landing.philosophyLabel}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {landing.manifestoTitle}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {landing.manifestoDescription}
          </p>
        </div>

        {/* Centerpiece Quote Card */}
        <div className="mx-auto mt-12 max-w-4xl rounded-[var(--radius-xl)] border border-border/80 bg-surface/80 p-8 sm:p-14 shadow-xs">
          <blockquote className="text-xl font-medium tracking-[-0.03em] text-foreground sm:text-2xl sm:leading-relaxed text-center">
            {locale === "es"
              ? "“En un consultorio de ritmo ágil, la claridad no es un capricho estético: es un principio de seguridad para el paciente. DMS elimina el ruido visual y los elementos superfluos para que el equipo clínico dedique toda su atención a lo verdaderamente importante: las personas.”"
              : "“In a fast-moving practice, clarity is not an aesthetic luxury: it is a patient-safety principle. DMS removes visual noise and unnecessary elements so the clinical team can focus on what matters: people.”"}
          </blockquote>
          <div className="mt-8 flex flex-col items-center justify-center border-t border-border/70 pt-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              {locale === "es" ? "Dra. Jane Smith" : "Dr. Jane Smith"}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === "es"
                ? "Directora de Operaciones Clínicas · Atelier Dental"
                : "Director of Clinical Operations · Atelier Dental"}
            </p>
            <span className="mt-2 rounded-full bg-secondary/80 px-3 py-1 font-mono text-[10px] text-muted-foreground">
              {locale === "es"
                ? "Estándar Operativo Atelier Dental · Arquitectura clínica a medida"
                : "Atelier Dental operating standard · Purpose-built clinical architecture"}
            </span>
          </div>
        </div>

        {/* 3 Core Practice Tenets */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              01 · {locale === "es" ? "Ergonomía serena" : "Calm ergonomics"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {locale === "es" ? "Interfaces calmas" : "Calm interfaces"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {locale === "es"
                ? "Los gabinetes de atención demandan concentración y serenidad. Sin ventanas emergentes, sin elementos publicitarios ni menús innecesarios."
                : "Operatories demand concentration and calm. No pop-ups, promotional elements, or unnecessary menus."}
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              02 · {locale === "es" ? "Ritmo temporal" : "Time rhythm"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {locale === "es" ? "Cadencia estructurada" : "Structured cadence"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {locale === "es"
                ? "Diseñado en torno a intervalos realistas de 30 minutos que contemplan tiempos de esterilización, preparación de sillón y consulta con el paciente."
                : "Built around realistic 30-minute intervals that account for sterilization, operatory setup, and patient consultation."}
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border/70 bg-surface/60 p-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              03 ·{" "}
              {locale === "es"
                ? "Confiabilidad rigurosa"
                : "Rigorous reliability"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {locale === "es"
                ? "Sincronización transaccional"
                : "Transactional synchronization"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {locale === "es"
                ? "Persistencia inmediata respaldada por integridad relacional, manteniendo a recepción y a los odontólogos en continua sincronía."
                : "Immediate persistence backed by relational integrity, keeping reception and clinicians continuously in sync."}
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
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {landing.demoLabel}
            </p>
            <h2
              className="mt-3.5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
              id="demo-invitation-title"
            >
              {landing.demoTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {landing.demoDescription}
            </p>

            {/* Sandbox Features Checklist */}
            <div className="mt-6 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  {locale === "es"
                    ? "Agenda de cinco días y múltiples sillones con turnos en vivo"
                    : "Five-day schedule with multiple operatories and live appointments"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  {locale === "es"
                    ? "Dieciséis fichas de pacientes con alertas médicas e historial de visitas"
                    : "Sixteen patient records with medical alerts and visit history"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  {locale === "es"
                    ? "Catálogo clínico de tratamientos con duraciones de referencia"
                    : "Clinical treatment catalog with reference durations"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  aria-hidden
                  className="size-4 text-accent shrink-0"
                />
                <span>
                  {locale === "es"
                    ? "Notas cronológicas de pase de guardia con autoría profesional"
                    : "Chronological handover notes with professional authorship"}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/demo/access">
                  {landing.openDemoCta}
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
                {locale === "es"
                  ? "Sesión instantánea preconfigurada · Entorno seguro de muestra · Datos reajustables"
                  : "Instant pre-configured session · Safe sample environment · Resettable data"}
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
                      {locale === "es"
                        ? "Pase de acreditación clínica"
                        : "Clinical access pass"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className="gap-1 border-border/80 bg-secondary/60 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground/80"
                    variant="outline"
                  >
                    <ShieldCheck aria-hidden className="size-3 text-accent" />
                    {locale === "es" ? "Sesión verificada" : "Verified session"}
                  </Badge>
                  <p className="mt-1 font-mono text-[9px] tracking-widest text-muted-foreground/80">
                    REF · AT-2026-OP
                  </p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    {locale === "es" ? "Rol en clínica" : "Clinical role"}
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {locale === "es"
                      ? "Directora de Operaciones Clínicas"
                      : "Director of Clinical Operations"}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    {locale === "es"
                      ? "Identidad de sesión"
                      : "Session identity"}
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {locale === "es"
                      ? "Dra. Jane Smith · Directora Médica"
                      : "Dr. Jane Smith · Medical Director"}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    {locale === "es" ? "Fecha del espacio" : "Workspace date"}
                  </dt>
                  <dd className="mt-1 font-mono text-foreground">
                    {locale === "es"
                      ? "Martes, 12 de mayo de 2026"
                      : "Tuesday, May 12, 2026"}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-muted-foreground">
                    {locale === "es"
                      ? "Resguardo de privacidad"
                      : "Privacy boundary"}
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {locale === "es"
                      ? "Entorno clínico aislado"
                      : "Isolated clinical environment"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-dashed border-border/80 pt-5">
                <Button asChild className="w-full shadow-2xs" variant="outline">
                  <Link href="/demo/access">
                    <KeyRound aria-hidden className="size-3.5" />
                    {landing.openDemoCta}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </Button>
                <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/80">
                  {locale === "es"
                    ? "Acceso directo sin claves · Entorno de práctica aislado"
                    : "Direct access without passwords · Isolated practice environment"}
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
                {locale === "es"
                  ? "Un espacio de gestión clínica enfocado, concebido para el ritmo semanal del consultorio. Turnos diarios, fichas de pacientes, catálogo de tratamientos y notas de pase de guardia unificados en un entorno sereno."
                  : "A focused clinical operations workspace built for the practice's weekly rhythm. Daily appointments, patient records, treatments, and handover notes in one calm environment."}
              </p>
              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-accent shrink-0"
                />
                <span>
                  {locale === "es"
                    ? "Entorno clínico sintético con privacidad garantizada"
                    : "Synthetic clinical environment with privacy by design"}
                </span>
              </div>
            </div>

            {/* Navigation Lists: 3 Balanced, Aligned Columns */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
              {/* Column 2: Surfaces */}
              <div>
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
                  {locale === "es" ? "Vistas del espacio" : "Workspace views"}
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/schedule"
                    >
                      {locale === "es"
                        ? "Agenda · Vista semanal de 5 días"
                        : "Schedule · 5-day weekly view"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/dashboard"
                    >
                      {locale === "es"
                        ? "Hoy · Agenda del día"
                        : "Today · Daily schedule"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/patients"
                    >
                      {locale === "es"
                        ? "Pacientes · Directorio e historial"
                        : "Patients · Directory and history"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/treatments"
                    >
                      {locale === "es"
                        ? "Tratamientos · Catálogo clínico"
                        : "Treatments · Clinical catalog"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/demo/notes"
                    >
                      {locale === "es"
                        ? "Notas · Pases de guardia y evoluciones"
                        : "Notes · Handover and progress"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Systems & Standards */}
              <div>
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
                  {locale === "es"
                    ? "Sistemas y estándares"
                    : "Systems and standards"}
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    {locale === "es"
                      ? "Interfaz ágil renderizada en servidor"
                      : "Fast server-rendered interface"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Agenda sin riesgo de solapamiento"
                      : "Schedule without overlap risk"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Respuesta inmediata en cada acción"
                      : "Immediate feedback on every action"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Sesiones de demostración aisladas"
                      : "Isolated demo sessions"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Accesibilidad completa WCAG AA"
                      : "Full WCAG AA accessibility"}
                  </li>
                </ul>
              </div>

              {/* Column 4: Direct Access */}
              <div>
                <p className="flex h-8 items-center text-xs font-semibold uppercase tracking-wider text-foreground">
                  {locale === "es" ? "Evaluación" : "Evaluation"}
                </p>
                <ul className="mt-3.5 space-y-2.5 text-xs text-muted-foreground">
                  <li>
                    <Link
                      className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-accent"
                      href="/demo/access"
                    >
                      {landing.openDemoCta}
                      <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  </li>
                  <li>
                    {locale === "es"
                      ? "Sin registro ni formularios"
                      : "No sign-up or forms"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Restablecimiento de datos en un clic"
                      : "One-click data reset"}
                  </li>
                  <li>
                    {locale === "es"
                      ? "Sin datos reales de pacientes"
                      : "No real patient data"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom copyright bar */}
          <div className="flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              {locale === "es"
                ? "© 2026 Atelier Dental. Diseñado para la continuidad operativa en la práctica clínica."
                : "© 2026 Atelier Dental. Designed for continuity in clinical practice."}
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono sm:gap-6">
              <span>
                {locale === "es"
                  ? "Ingeniería a medida"
                  : "Purpose-built engineering"}
              </span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>
                {locale === "es"
                  ? "Diseño de sistemas clínicos"
                  : "Clinical systems design"}
              </span>
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
