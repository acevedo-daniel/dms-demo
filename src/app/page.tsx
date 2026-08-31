import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  NotebookPen,
  UsersRound,
} from "lucide-react";
import dashboardScreenshot from "../../docs/screenshots/dashboard.webp";
import { DmsLogo } from "@/components/dms-logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Practice operations workspace",
  description:
    "Explore DMS, a focused workspace for scheduling, patient context, treatments, and operational notes.",
  alternates: {
    canonical: "/",
  },
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
            <Link href="/demo/access">Explore demo</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Practice operations workspace
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              A quieter way to coordinate the day.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              DMS keeps a single practice&apos;s schedule, patient context,
              treatment catalog, and operational notes in one composed daily
              view.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/demo/access">
                  Explore workspace
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <figure className="border border-border bg-card p-2 sm:p-3">
            <Image
              alt="DMS dashboard showing a day of appointments, follow-up work, and recent notes"
              className="aspect-video w-full border border-border object-cover"
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              src={dashboardScreenshot}
            />
            <figcaption className="px-1 pt-3 text-sm text-muted-foreground">
              Dashboard · Tuesday, 12 May 2026 · Fictional Atelier Dental
              baseline.
            </figcaption>
          </figure>
        </div>

        <section aria-labelledby="workflow-title" className="mt-16 sm:mt-20">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Workflow
            </p>
            <h2
              className="mt-3 text-2xl font-semibold tracking-tight"
              id="workflow-title"
            >
              The practice day, kept connected.
            </h2>
          </div>
          <ol className="mt-7 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map(({ description, icon: Icon, label }, index) => (
              <li
                className="border-border px-0 py-7 sm:px-6 sm:odd:border-r lg:border-r lg:last:border-r-0"
                key={label}
              >
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
                <Icon aria-hidden className="mt-6 size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16 grid gap-10 border-t border-border pt-10 lg:grid-cols-2 lg:gap-16">
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Designed around the next action
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              Scheduling, records, and visible status carry the interface.
              Decorative metrics and generic dashboard cards do not.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              A bounded, repeatable demo
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              A fixed demo day, provisioned session, and resettable fictional
              dataset keep each walkthrough consistent.
            </p>
          </section>
        </div>

        <section
          aria-labelledby="demo-invitation-title"
          className="mt-16 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Public demo
            </p>
            <h2
              className="mt-3 text-2xl font-semibold tracking-tight"
              id="demo-invitation-title"
            >
              A self-contained workspace to explore.
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Open a provisioned session with resettable fictional data. No
              account or shared credential is required.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/demo/access">
              Explore workspace
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </section>
      </section>
    </main>
  );
}
