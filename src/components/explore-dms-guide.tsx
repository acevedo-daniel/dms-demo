"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";

export function ExploreDmsGuide() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(true);

  const guideItems = useMemo(
    () => [
      {
        description: t.guide.items.scheduleDesc,
        href: "/demo/schedule",
        label: t.guide.items.scheduleTitle,
      },
      {
        description: t.guide.items.patientDesc,
        href: `/demo/patients/${alexQuinnId}`,
        label: t.guide.items.patientTitle,
      },
      {
        description: t.guide.items.rescheduleDesc,
        href: "/demo/schedule",
        label: t.guide.items.rescheduleTitle,
      },
      {
        description: t.guide.items.noteDesc,
        href: "/demo/notes",
        label: t.guide.items.noteTitle,
      },
    ],
    [t.guide.items],
  );

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
              {t.guide.badge}
            </span>
            <span className="rounded-full border border-border/70 bg-secondary/60 px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              {t.guide.stepsCount}
            </span>
          </div>
          <h2
            className="mt-2 text-lg font-semibold tracking-tight sm:text-xl text-foreground"
            id="explore-title"
          >
            {t.guide.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.guide.description}
          </p>
        </div>
        <Button
          aria-label={t.guide.dismissAria}
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
