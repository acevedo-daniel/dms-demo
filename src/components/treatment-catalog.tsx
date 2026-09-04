"use client";

import Link from "next/link";
import { CalendarPlus, ChevronDown, Clock3, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const displayedGroups = useMemo(() => {
    const baseGroups =
      selectedCategory === "all"
        ? groups
        : groups.filter((group) => group.category === selectedCategory);

    if (!normalizedSearch) {
      return baseGroups;
    }

    return baseGroups
      .map((group) => ({
        category: group.category,
        treatments: group.treatments.filter(
          (t) =>
            t.name.toLowerCase().includes(normalizedSearch) ||
            t.description.toLowerCase().includes(normalizedSearch) ||
            t.category.toLowerCase().includes(normalizedSearch),
        ),
      }))
      .filter((group) => group.treatments.length > 0);
  }, [groups, normalizedSearch, selectedCategory]);

  const totalFilteredTreatments = useMemo(
    () =>
      displayedGroups.reduce(
        (accumulator, group) => accumulator + group.treatments.length,
        0,
      ),
    [displayedGroups],
  );

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
      {/* Search & Category Filter Navigation */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md flex-1">
          <div className="flex items-center justify-between gap-2">
            <label
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              htmlFor="treatment-catalog-search"
            >
              Filter catalog
            </label>
            {searchQuery ? (
              <span className="text-xs font-medium text-muted-foreground">
                {totalFilteredTreatments}{" "}
                {totalFilteredTreatments === 1 ? "protocol" : "protocols"}
              </span>
            ) : null}
          </div>
          <div className="relative mt-1.5">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="h-10 rounded-[var(--radius-md)] border-border/80 bg-background/60 pl-10 pr-10 text-sm shadow-xs backdrop-blur-xs transition-all focus:border-foreground/30 focus:bg-background"
              id="treatment-catalog-search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search protocols or keywords"
              value={searchQuery}
            />
            {searchQuery ? (
              <Button
                aria-label="Clear search"
                className="absolute top-1/2 right-2 size-7 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden className="size-3.5" />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Category Pills (Subtle, Sobrio) */}
        <nav
          aria-label="Filter treatments by category"
          className="inline-flex items-center rounded-full border border-border/80 bg-surface/80 p-1 shadow-xs backdrop-blur-xs self-start lg:self-end overflow-x-auto"
        >
          <button
            aria-pressed={selectedCategory === "all"}
            className={cn(
              "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-secondary text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setSelectedCategory("all")}
            type="button"
          >
            <span>All protocols</span>
            <span className="ml-1 opacity-70">({treatments.length})</span>
          </button>
          {groups.map((group) => (
            <button
              aria-pressed={selectedCategory === group.category}
              className={cn(
                "dms-pressable rounded-full px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
                selectedCategory === group.category
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              key={group.category}
              onClick={() => setSelectedCategory(group.category)}
              type="button"
            >
              <span>{group.category}</span>
              <span className="ml-1 opacity-70">
                ({group.treatments.length})
              </span>
            </button>
          ))}
        </nav>
      </div>

      {displayedGroups.length ? (
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
      ) : (
        <section
          aria-labelledby="no-treatment-results-title"
          className="mt-8 rounded-[var(--radius-lg)] border border-border/80 bg-card/40 py-12 text-center shadow-xs"
        >
          <h2
            className="text-base font-semibold text-foreground"
            id="no-treatment-results-title"
          >
            No treatments match this search.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try searching by another term or clear the active specialty filter.
          </p>
          <Button
            className="mt-4 font-semibold shadow-xs"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            variant="outline"
          >
            Reset filters
          </Button>
        </section>
      )}
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
          className="text-base font-semibold tracking-tight text-foreground"
          id={headingId}
        >
          {group.category}
        </h2>
        <Badge
          className="border-border/70 bg-secondary/50 text-[11px] font-medium tabular-nums text-muted-foreground"
          variant="outline"
        >
          {group.treatments.length}
        </Badge>
      </div>

      <ol className="mt-3.5 space-y-2.5">
        {group.treatments.map((treatment) => {
          const selected = selectedTreatmentId === treatment.id;
          const expanded = selected || expandedId === treatment.id;

          return (
            <li
              className={cn(
                "group relative rounded-[var(--radius-lg)] border border-border/80 bg-card/30 p-4.5 shadow-xs transition-all duration-150 hover:border-foreground/20 hover:bg-card hover:shadow-xs",
                selected &&
                  "border-foreground/30 bg-secondary/30 ring-1 ring-foreground/20 shadow-xs",
              )}
              id={`treatment-${treatment.id}`}
              key={treatment.id}
              tabIndex={selected ? -1 : undefined}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                      {treatment.category}
                    </span>
                    {selected ? (
                      <span className="rounded border border-border bg-foreground text-background px-2 py-0.5 text-[10px] font-medium">
                        Selected context
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1.5">
                    <button
                      aria-controls={`treatment-details-${treatment.id}`}
                      aria-expanded={expanded}
                      className="dms-pressable -ml-1 inline-flex min-h-8 items-center gap-2 rounded-[var(--radius-sm)] px-1 text-left text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() =>
                        onExpandedChange(expanded ? null : treatment.id)
                      }
                      type="button"
                    >
                      <span>{treatment.name}</span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-3.5 text-muted-foreground/60 transition-transform duration-[var(--motion-fast)] motion-reduce:transition-none",
                          expanded && "rotate-180 text-foreground",
                        )}
                      />
                    </button>
                    <p className="mt-0.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {treatment.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-1 text-xs font-medium tabular-nums text-foreground/80">
                    <Clock3
                      aria-hidden
                      className="size-3 text-muted-foreground"
                    />
                    <span className="font-mono text-[11px]">
                      {treatment.defaultDurationMinutes} min
                    </span>
                  </div>
                  <Button
                    asChild
                    className="h-8.5 px-3.5 font-semibold text-xs shadow-xs"
                    size="sm"
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
                  className="mt-3.5 rounded-[var(--radius-md)] border border-border/70 bg-secondary/20 p-3.5 text-xs leading-relaxed text-muted-foreground"
                  id={`treatment-details-${treatment.id}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-muted-foreground">
                      Baseline practice allocation:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {treatment.defaultDurationMinutes} minutes
                      </span>{" "}
                      in Operatory 1 or 2.
                    </p>
                    <Link
                      className="inline-flex shrink-0 items-center font-medium text-foreground underline-offset-4 hover:underline"
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
