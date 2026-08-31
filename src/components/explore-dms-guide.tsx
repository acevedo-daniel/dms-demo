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

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="explore-title"
      className="mt-10 border-y border-border py-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Suggested walkthrough
          </p>
          <h2 className="mt-2 font-medium" id="explore-title">
            Explore DMS
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A short path through the sample workspace.
          </p>
        </div>
        <Button
          aria-label="Dismiss Explore DMS guide"
          className="-mt-2 -mr-2"
          onClick={() => setIsVisible(false)}
          size="icon"
          variant="ghost"
        >
          <X aria-hidden className="size-4" />
        </Button>
      </div>
      <ol className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {guideItems.map((item, index) => (
          <li className="flex gap-3" key={item.label}>
            <span className="pt-0.5 font-mono text-xs text-muted-foreground">
              0{index + 1}
            </span>
            <Link
              className="group min-w-0 font-medium text-primary"
              href={item.href}
            >
              <span className="inline-flex items-center gap-1 underline-offset-4 group-hover:underline">
                {item.label}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </span>
              <span className="mt-1 block text-sm font-normal leading-6 text-muted-foreground">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
