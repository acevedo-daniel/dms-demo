"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocale, type Locale } from "@/lib/i18n";

type AppointmentStatus =
  "SCHEDULED" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "CANCELLED";

const statusLabels: Record<Locale, Record<AppointmentStatus, string>> = {
  es: {
    SCHEDULED: "Programado",
    CONFIRMED: "Confirmado",
    ARRIVED: "En recepción",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  },
  en: {
    SCHEDULED: "Scheduled",
    CONFIRMED: "Confirmed",
    ARRIVED: "Arrived",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  },
};

const dotClasses: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-muted-foreground/60",
  CONFIRMED: "bg-accent",
  ARRIVED: "bg-info",
  COMPLETED: "bg-foreground/70",
  CANCELLED: "bg-destructive/70",
};

export function AppointmentStatusBadge({
  className,
  status,
  locale: propLocale,
}: {
  className?: string;
  status: AppointmentStatus;
  locale?: Locale;
}) {
  const contextLocale = useLocale();
  const activeLocale = propLocale || contextLocale || "es";
  const label = statusLabels[activeLocale]?.[status] ?? statusLabels.es[status];
  const dotClass = dotClasses[status];

  return (
    <Badge
      className={cn(
        "gap-1.5 border-border/80 bg-secondary/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 shadow-2xs backdrop-blur-xs transition-colors hover:bg-secondary/60",
        className,
      )}
      variant="outline"
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", dotClass)}
      />
      <span>{label}</span>
    </Badge>
  );
}
