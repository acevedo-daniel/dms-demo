import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  NotebookPen,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { DmsLogo } from "@/components/dms-logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "DMS — Practice operations workspace",
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
      "Keep a focused weekly view of appointments and the next action.",
    icon: CalendarDays,
    label: "Schedule",
  },
  {
    description:
      "Move from an appointment to a clear patient context without repetition.",
    icon: UsersRound,
    label: "Patient context",
  },
  {
    description:
      "Use a concise catalog to keep the appointment service visible.",
    icon: Stethoscope,
    label: "Treatments",
  },
  {
    description:
      "Record brief operational notes where they belong: with the patient.",
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
          <Button asChild size="sm" variant="outline">
            <Link href="/demo/access">Explore demo</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Practice operations workspace
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            A quieter way to coordinate the day.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            DMS brings appointments, patient context, treatment details, and
            operational notes into one considered workspace for a dental
            practice.
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

        <ol className="mt-16 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map(({ description, icon: Icon, label }, index) => (
            <li
              className="border-border px-0 py-7 sm:px-6 sm:odd:border-r lg:border-r lg:last:border-r-0"
              key={label}
            >
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1}
              </span>
              <Icon aria-hidden className="mt-6 size-5 text-primary" />
              <h2 className="mt-4 text-base font-semibold">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 border-t border-border pt-10 lg:grid-cols-2 lg:gap-16">
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              Designed around the next action
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              The workspace favors a readable schedule, clear records, and
              visible system status over decorative metrics and crowded
              dashboard cards.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight">
              A bounded, repeatable demo
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              Explore a fictional sample practice with a real session and
              resettable data. The walkthrough stays consistent across every
              visit.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
