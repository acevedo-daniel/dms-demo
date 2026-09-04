import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "dms-field file:text-foreground placeholder:text-muted-foreground selection:bg-accent-soft selection:text-accent-soft-foreground border-input flex h-[var(--control-md)] w-full min-w-0 rounded-[var(--radius-sm)] border bg-card px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-accent focus-visible:bg-surface transition-colors",
        "aria-invalid:border-destructive/80 aria-invalid:ring-2 aria-invalid:ring-destructive/15 aria-invalid:bg-destructive/[0.02] aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
