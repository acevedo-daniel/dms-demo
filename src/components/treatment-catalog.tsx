"use client";

import { ChevronDown } from "lucide-react";
import { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TreatmentCatalogItem } from "@/lib/treatments";

export function TreatmentCatalog({
  treatments,
}: {
  treatments: TreatmentCatalogItem[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!treatments.length) {
    return (
      <section className="mt-8 border-y border-border py-12 text-center">
        <p className="font-medium">
          No treatments are available in this demo workspace.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="mt-8 hidden overflow-hidden border-y border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Treatment</TableHead>
              <TableHead scope="col">Category</TableHead>
              <TableHead scope="col">Default duration</TableHead>
              <TableHead scope="col">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((treatment) => {
              const expanded = expandedId === treatment.id;

              return (
                <Fragment key={treatment.id}>
                  <TableRow>
                    <TableCell className="font-medium">
                      {treatment.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {treatment.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {treatment.defaultDurationMinutes} minutes
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        aria-controls={`treatment-details-${treatment.id}`}
                        aria-expanded={expanded}
                        aria-label={`${expanded ? "Hide" : "Show"} details for ${treatment.name}`}
                        className="dms-pressable inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm font-medium text-primary hover:bg-accent-soft focus-visible:outline-none"
                        onClick={() =>
                          setExpandedId(expanded ? null : treatment.id)
                        }
                        type="button"
                      >
                        Details
                        <ChevronDown
                          aria-hidden
                          className={`size-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                  {expanded ? (
                    <TableRow>
                      <TableCell
                        id={`treatment-details-${treatment.id}`}
                        className="bg-secondary/50 py-5 text-sm leading-6 text-muted-foreground"
                        colSpan={4}
                      >
                        {treatment.description}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ol className="mt-8 divide-y divide-border border-y border-border md:hidden">
        {treatments.map((treatment) => {
          const expanded = expandedId === treatment.id;

          return (
            <li key={treatment.id}>
              <button
                aria-controls={`treatment-details-${treatment.id}`}
                aria-expanded={expanded}
                className="dms-pressable flex min-h-16 w-full items-center justify-between gap-4 rounded-[var(--radius-sm)] py-4 text-left hover:bg-secondary/70 focus-visible:outline-none"
                onClick={() => setExpandedId(expanded ? null : treatment.id)}
                type="button"
              >
                <span>
                  <span className="block font-medium">{treatment.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {treatment.category} · {treatment.defaultDurationMinutes}{" "}
                    minutes
                  </span>
                </span>
                <ChevronDown
                  aria-hidden
                  className={`size-4 shrink-0 text-primary transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded ? (
                <p
                  className="pb-5 text-sm leading-6 text-muted-foreground"
                  id={`treatment-details-${treatment.id}`}
                >
                  {treatment.description}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}
