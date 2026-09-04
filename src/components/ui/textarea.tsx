import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "dms-field border-input placeholder:text-muted-foreground focus-visible:border-accent focus-visible:bg-surface flex field-sizing-content min-h-24 w-full rounded-[var(--radius-sm)] border bg-card px-3 py-2 text-base outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-destructive/80 aria-invalid:ring-2 aria-invalid:ring-destructive/15 aria-invalid:bg-destructive/[0.02] aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
