"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const alexQuinnId = "30000000-0000-4000-8000-000000000001";

const guideItems = [
  { href: "/demo/schedule", label: "Review today's agenda" },
  {
    href: `/demo/patients/${alexQuinnId}`,
    label: "Open a patient record",
  },
  { href: "/demo/schedule", label: "Reschedule an appointment" },
  { href: "/demo/notes", label: "Add a note" },
];

export function ExploreDmsGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="explore-title"
      className="mt-10 border-t border-border pt-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium" id="explore-title">
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
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {guideItems.map((item) => (
          <li key={item.label}>
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
