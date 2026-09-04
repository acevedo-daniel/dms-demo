"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";

const guideItems = [
  {
    description: "See the demo day in chronological order.",
    href: "/demo/schedule",
    label: "Review today's agenda",
  },
  {
    description: "Follow an appointment into its patient context.",
    href: `/demo/patients/${alexQuinnId}`,
    label: "Open a patient record",
  },
  {
    description: "Open an active appointment to change its time.",
    href: "/demo/schedule",
    label: "Reschedule an appointment",
  },
  {
    description: "Record a concise operational detail.",
    href: "/demo/notes",
    label: "Add a note",
  },
];

export function ExploreDmsGuide() {
  const [isVisible, setIsVisible] = useState(true);

  function dismissGuide() {
    setIsVisible(false);
    window.requestAnimationFrame(() => {
      document.getElementById("today-agenda-title")?.focus();
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="explore-title"
      className="mt-12 rounded-[var(--radius-lg)] border border-border/80 bg-gradient-to-b from-card/70 via-card/40 to-card/10 p-6 sm:p-7 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Suggested walkthrough
            </span>
            <span className="rounded-[var(--radius-pill)] bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
              4 steps
            </span>
          </div>
          <h2
            className="mt-2 text-lg font-semibold tracking-tight sm:text-xl text-foreground"
            id="explore-title"
          >
            Explore DMS
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A short, curated path through the clinical workspace operations.
          </p>
        </div>
        <Button
          aria-label="Dismiss Explore DMS guide"
          className="size-8 rounded-full border border-border/70 hover:bg-secondary/70 hover:text-foreground"
          onClick={dismissGuide}
          size="icon"
          variant="ghost"
        >
          <X aria-hidden className="size-4" />
        </Button>
      </div>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {guideItems.map((item, index) => (
          <li key={item.label}>
            <Link
              className="group flex h-full flex-col justify-between rounded-[var(--radius-md)] border border-border/60 bg-background/50 p-4 transition-all duration-150 hover:border-foreground/25 hover:bg-card hover:shadow-xs"
              href={item.href}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-primary/80">
                    0{index + 1}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  />
                </div>
                <p className="mt-2.5 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {item.label}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
