import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "dms-pressable inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "dms-raised-action border border-primary bg-primary text-primary-foreground hover:border-foreground-secondary hover:bg-foreground-secondary",
        destructive:
          "dms-raised-action border border-destructive bg-destructive text-white hover:border-destructive/90 hover:bg-destructive/90",
        outline:
          "dms-raised-action border border-input bg-card text-foreground hover:bg-secondary",
        secondary:
          "dms-raised-action border border-border bg-card text-foreground hover:bg-secondary",
        ghost: "hover:bg-secondary active:bg-secondary/80",
        link: "text-foreground underline-offset-4 hover:underline active:no-underline",
      },
      size: {
        default: "h-[var(--control-md)] px-4 py-2 has-[>svg]:px-3",
        sm: "h-[var(--control-sm)] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-[var(--control-lg)] px-6 has-[>svg]:px-4",
        icon: "size-[var(--touch-target-min)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
