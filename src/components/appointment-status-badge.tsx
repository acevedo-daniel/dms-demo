import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const appointmentStatusPresentation: Record<
  AppointmentStatus,
  { dotClass: string; label: string }
> = {
  SCHEDULED: {
    dotClass: "bg-muted-foreground/60",
    label: "Scheduled",
  },
  CONFIRMED: {
    dotClass: "bg-emerald-600/90 dark:bg-emerald-400/90",
    label: "Confirmed",
  },
  COMPLETED: {
    dotClass: "bg-foreground/70",
    label: "Completed",
  },
  CANCELLED: {
    dotClass: "bg-destructive/70",
    label: "Cancelled",
  },
};

function AppointmentStatusBadge({
  className,
  status,
}: {
  className?: string;
  status: AppointmentStatus;
}) {
  const { dotClass, label } = appointmentStatusPresentation[status];

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

export { AppointmentStatusBadge };
