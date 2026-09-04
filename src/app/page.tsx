import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Database,
  LockKeyhole,
  NotebookPen,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import scheduleScreenshot from "../../docs/screenshots/schedule.webp";
import { DmsLogo } from "@/components/dms-logo";
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

const workflow = [
  {
    description:
      "Plan the five-day workweek, see status, and create from an open slot.",
    icon: CalendarDays,
    label: "Schedule",
  },
  {
    description:
      "Open history, the next appointment, and context without re-entering patient details.",
    icon: UsersRound,
    label: "Patient context",
  },
  {
    description: "Reference the treatment catalog and its default durations.",
    icon: ClipboardList,
    label: "Treatments",
  },
  {
    description:
      "Keep concise coordination details attached to the patient record.",
    icon: NotebookPen,
    label: "Notes",
  },
];

const engineeringSignals = [
  {
    description:
      "Fixed five-day practice schedule, 30-minute precision slots, and a deterministic appointment timeline.",
    icon: CalendarDays,
    label: "100% Deterministic Seed",
  },
  {
    description:
      "PostgreSQL transactions, Drizzle migrations, and session-gated Better Auth support the workspace.",
    icon: Database,
    label: "Real PostgreSQL",
  },
  {
    description:
      "Keyboard flows, contrast, and screen-reader behavior are covered with Playwright checks.",
    icon: ShieldCheck,
    label: "Automated WCAG AA Coverage",
  },
  {
    description:
      "Atelier Dental, every person, and every record are fictional and resettable to a curated baseline.",
    icon: LockKeyhole,
    label: "Resettable Privacy Boundary",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <DmsLogo className="size-9" />
            <span className="text-sm font-semibold tracking-tight">DMS</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/demo/access">Open demo</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="max-w-xl lg:col-span-5 lg:pb-8">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Dental practice operations
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl sm:leading-[1.02] lg:text-7xl">
              A clearer way to run the practice day.
            </h1>
            <p className="mt-7 text-lg leading-8 text-muted-foreground">
              DMS brings appointments, patient context, treatments, and
              operational notes into one focused workspace for Atelier Dental.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/demo/access">
                  Open demo workspace
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <figure className="min-w-0 rounded-[var(--radius-lg)] border border-border bg-card p-2 shadow-[0_24px_64px_-12px_rgb(23_23_21_/_0.16)] ring-1 ring-black/[0.04] sm:p-3 lg:col-span-7">
            <Image
              alt="DMS Schedule showing the fictional Atelier Dental workweek with appointments across five days"
              className="aspect-[4/3] w-full rounded-[var(--radius-md)] border border-border object-cover object-left-top"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              src={scheduleScreenshot}
            />
            <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-1 pt-3 text-sm text-muted-foreground">
              <span>Schedule · 11–15 May 2026</span>
              <span>Fictional Atelier Dental baseline</span>
            </figcaption>
          </figure>
        </div>

        <section
          aria-labelledby="engineering-signals-title"
          className="mt-14 border-y border-border sm:mt-20"
        >
          <div className="flex flex-col gap-2 border-b border-border py-5 sm:flex-row sm:items-baseline sm:justify-between">
            <h2
              className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary"
              id="engineering-signals-title"
            >
              Engineering signals
            </h2>
            <p className="text-sm text-muted-foreground">
              Concrete boundaries behind the public demo.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {engineeringSignals.map(({ description, icon: Icon, label }) => (
              <li
                className="border-border px-0 py-6 sm:px-6 sm:odd:border-l lg:border-l lg:first:border-l-0"
                key={label}
              >
                <Icon aria-hidden className="size-5 text-primary" />
                <h3 className="mt-5 text-sm font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="workflow-title" className="mt-16 sm:mt-20">
          <div className="grid gap-6 border-b border-border pb-7 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Connected workflow
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.035em]"
                id="workflow-title"
              >
                The practice day, kept connected.
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-muted-foreground lg:col-span-6 lg:col-start-7">
              Each surface answers the next operational question without
              creating a parallel system of record.
            </p>
          </div>
          <ol className="divide-y divide-border">
            {workflow.map(({ description, icon: Icon, label }, index) => (
              <li
                className="grid gap-4 py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.15fr)] sm:items-start sm:gap-6"
                key={label}
              >
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <Icon aria-hidden className="size-5 text-primary" />
                  <h3 className="text-lg font-semibold tracking-tight">
                    {label}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="demo-invitation-title"
          className="mt-16 border-t border-border pt-10 sm:mt-20"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="max-w-2xl lg:col-span-7">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Public demo
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.035em]"
                id="demo-invitation-title"
              >
                Explore a complete, bounded practice day.
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                A provisioned session opens instantly with fictional, resettable
                data. No account or shared credential is required.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Button asChild size="lg">
                <Link href="/demo/access">
                  Open demo workspace
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
