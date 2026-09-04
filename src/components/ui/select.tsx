import * as React from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "dms-field border-input bg-card text-foreground flex h-[var(--control-md)] w-full min-w-0 rounded-[var(--radius-sm)] border px-3 text-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-accent focus-visible:bg-surface aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
