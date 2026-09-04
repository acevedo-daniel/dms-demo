"use client";

import Link from "next/link";
import { CalendarPlus, ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TreatmentCatalogItem } from "@/lib/treatments";
import { cn } from "@/lib/utils";

type TreatmentCatalogProps = {
  initialTreatmentId?: string;
  treatments: TreatmentCatalogItem[];
};

type TreatmentGroup = {
  category: string;
  treatments: TreatmentCatalogItem[];
};

export function TreatmentCatalog({
  initialTreatmentId,
  treatments,
}: TreatmentCatalogProps) {
  const selectedTreatmentId = treatments.some(
    (treatment) => treatment.id === initialTreatmentId,
  )
    ? initialTreatmentId
    : undefined;
  const [expandedId, setExpandedId] = useState<string | null>(
    selectedTreatmentId ?? null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const groups = useMemo(() => {
    const grouped = new Map<string, TreatmentCatalogItem[]>();

    for (const treatment of treatments) {
      grouped.set(treatment.category, [
        ...(grouped.get(treatment.category) ?? []),
        treatment,
      ]);
    }

    return [...grouped.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([category, catalogTreatments]) => ({
        category,
        treatments: catalogTreatments,
      }));
  }, [treatments]);

  const displayedGroups = useMemo(() => {
    if (selectedCategory === "all") {
      return groups;
    }
    return groups.filter((group) => group.category === selectedCategory);
  }, [groups, selectedCategory]);

  useEffect(() => {
    if (!selectedTreatmentId) {
      return;
    }

    const target = document.getElementById(`treatment-${selectedTreatmentId}`);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [selectedTreatmentId]);

  if (!treatments.length) {
    return (
      <section className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs">
        <p className="font-semibold text-foreground">
          No treatment references are available.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Treatment catalog data could not be loaded.
        </p>
      </section>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Category filter pills */}
      <nav
        aria-label="Filter treatments by category"
        className="flex items-center gap-1.5 overflow-x-auto pb-1"
      >
        <button
          className={cn(
            "dms-pressable inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
            selectedCategory === "all"
              ? "border border-primary/20 bg-primary text-primary-foreground font-semibold shadow-xs"
              : "border border-border/70 bg-secondary/50 text-muted-foreground hover:border-foreground/20 hover:bg-secondary hover:text-foreground",
          )}
          onClick={() => setSelectedCategory("all")}
          type="button"
        >
          <span>All treatments</span>
          <span className="opacity-80">({treatments.length})</span>
        </button>
        {groups.map((group) => (
          <button
            className={cn(
              "dms-pressable inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
              selectedCategory === group.category
                ? "border border-primary/20 bg-primary text-primary-foreground font-semibold shadow-xs"
                : "border border-border/70 bg-secondary/50 text-muted-foreground hover:border-foreground/20 hover:bg-secondary hover:text-foreground",
            )}
            key={group.category}
            onClick={() => setSelectedCategory(group.category)}
            type="button"
          >
            <span>{group.category}</span>
            <span className="opacity-80">({group.treatments.length})</span>
          </button>
        ))}
      </nav>

      <div className="space-y-10">
        {displayedGroups.map((group) => (
          <TreatmentCatalogGroup
            expandedId={expandedId}
            group={group}
            key={group.category}
            onExpandedChange={setExpandedId}
            selectedTreatmentId={selectedTreatmentId}
          />
        ))}
      </div>
    </div>
  );
}

function TreatmentCatalogGroup({
  expandedId,
  group,
  onExpandedChange,
  selectedTreatmentId,
}: {
  expandedId: string | null;
  group: TreatmentGroup;
  onExpandedChange: (id: string | null) => void;
  selectedTreatmentId?: string;
}) {
  const headingId = `treatment-category-${group.category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-center gap-3">
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={headingId}
        >
          {group.category}
        </h2>
        <Badge className="text-xs font-medium tabular-nums" variant="secondary">
          {group.treatments.length}
        </Badge>
      </div>

      <ol className="mt-4 space-y-3">
        {group.treatments.map((treatment) => {
          const selected = selectedTreatmentId === treatment.id;
          const expanded = selected || expandedId === treatment.id;

          return (
            <li
              className={cn(
                "group relative rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs",
                selected &&
                  "border-primary/40 bg-accent-soft/40 shadow-xs ring-1 ring-primary/40",
              )}
              id={`treatment-${treatment.id}`}
              key={treatment.id}
              tabIndex={selected ? -1 : undefined}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <button
                    aria-controls={`treatment-details-${treatment.id}`}
                    aria-expanded={expanded}
                    className="dms-pressable -ml-1.5 inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-sm)] px-1.5 text-left text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-lg"
                    onClick={() =>
                      onExpandedChange(expanded ? null : treatment.id)
                    }
                    type="button"
                  >
                    <span>{treatment.name}</span>
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] motion-reduce:transition-none",
                        expanded && "rotate-180 text-primary",
                      )}
                    />
                  </button>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {treatment.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs font-medium tabular-nums text-foreground">
                    <Clock3 aria-hidden className="size-3.5 text-primary" />
                    <span>{treatment.defaultDurationMinutes} min</span>
                  </div>
                  <Button
                    asChild
                    className="h-9 px-3.5 font-semibold shadow-xs"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      aria-label={`Schedule ${treatment.name}`}
                      href={`/demo/schedule?create=1&treatment=${treatment.id}`}
                    >
                      <CalendarPlus aria-hidden className="size-3.5" />
                      Schedule
                    </Link>
                  </Button>
                </div>
              </div>

              {expanded ? (
                <div
                  className="mt-4 rounded-[var(--radius-md)] border border-border/70 bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground"
                  id={`treatment-details-${treatment.id}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-muted-foreground">
                      This reference uses the default{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {treatment.defaultDurationMinutes}-minute
                      </span>{" "}
                      scheduling duration. Confirm the patient and appointment
                      time in Schedule.
                    </p>
                    <Link
                      className="inline-flex items-center text-xs font-semibold text-primary underline-offset-4 hover:underline"
                      href={`/demo/schedule?create=1&treatment=${treatment.id}`}
                    >
                      Open in Schedule &rarr;
                    </Link>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
