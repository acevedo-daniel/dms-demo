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
      className="mt-12 rounded-[var(--radius-xl)] border border-border/80 bg-card/60 p-6 sm:p-7 shadow-xs backdrop-blur-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Practice walkthrough
            </span>
            <span className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
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
            A short, curated path through daily practice operations.
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
      <ol className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {guideItems.map((item, index) => (
          <li key={item.label}>
            <Link
              className="group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-border/70 bg-background/60 p-5 transition-all duration-200 hover:border-foreground/25 hover:bg-card hover:shadow-xs"
              href={item.href}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full border border-border/70 bg-secondary/80 font-mono text-xs font-semibold text-foreground/80 transition-colors group-hover:border-foreground/40 group-hover:bg-foreground group-hover:text-background">
                    {index + 1}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                  />
                </div>
                <p className="mt-3.5 text-sm font-semibold tracking-tight text-foreground">
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
