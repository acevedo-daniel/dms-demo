import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "dms-field border-input placeholder:text-muted-foreground focus-visible:border-accent focus-visible:bg-surface aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full rounded-[var(--radius-sm)] border bg-card px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
