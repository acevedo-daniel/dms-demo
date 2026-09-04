"use client";

import Link from "next/link";
import { CalendarPlus, ChevronDown } from "lucide-react";
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
      <section className="mt-8 border-y border-border py-12 text-center">
        <p className="font-medium">No treatment references are available.</p>
      </section>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {groups.map((group) => (
        <TreatmentCatalogGroup
          expandedId={expandedId}
          group={group}
          key={group.category}
          onExpandedChange={setExpandedId}
          selectedTreatmentId={selectedTreatmentId}
        />
      ))}
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
        <h2 className="text-xl font-semibold tracking-tight" id={headingId}>
          {group.category}
        </h2>
        <Badge className="font-mono tabular-nums" variant="secondary">
          {group.treatments.length}
        </Badge>
      </div>
      <ol className="mt-4 divide-y divide-border border-y border-border">
        {group.treatments.map((treatment) => {
          const selected = selectedTreatmentId === treatment.id;
          const expanded = selected || expandedId === treatment.id;

          return (
            <li
              className={cn(
                "scroll-mt-28 px-0 py-5 transition-colors",
                selected && "bg-accent-soft/60 ring-1 ring-primary/40",
              )}
              id={`treatment-${treatment.id}`}
              key={treatment.id}
              tabIndex={selected ? -1 : undefined}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <button
                    aria-controls={`treatment-details-${treatment.id}`}
                    aria-expanded={expanded}
                    className="dms-pressable inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] -ml-2 px-2 text-left text-lg font-semibold tracking-tight hover:text-primary focus-visible:outline-none"
                    onClick={() =>
                      onExpandedChange(expanded ? null : treatment.id)
                    }
                    type="button"
                  >
                    {treatment.name}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 text-primary transition-transform motion-reduce:transition-none",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {treatment.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                  <Badge className="font-mono tabular-nums" variant="outline">
                    {treatment.defaultDurationMinutes} min
                  </Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      aria-label={`Schedule ${treatment.name}`}
                      href={`/demo/schedule?create=1&treatment=${treatment.id}`}
                    >
                      <CalendarPlus aria-hidden className="size-4" />
                      Schedule
                    </Link>
                  </Button>
                </div>
              </div>
              {expanded ? (
                <div
                  className="mt-4 border-l-2 border-primary/35 pl-4 text-sm leading-6 text-muted-foreground"
                  id={`treatment-details-${treatment.id}`}
                >
                  This reference uses the default{" "}
                  {treatment.defaultDurationMinutes}-minute scheduling duration.
                  Confirm the patient and appointment time in Schedule.
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
