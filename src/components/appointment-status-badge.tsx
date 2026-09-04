import { CheckCircle2, CircleX, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const appointmentStatusPresentation: Record<
  AppointmentStatus,
  { className: string; icon: typeof Clock3; label: string }
> = {
  SCHEDULED: {
    className: "border-border/80 bg-secondary/60 text-muted-foreground",
    icon: Clock3,
    label: "Scheduled",
  },
  CONFIRMED: {
    className: "border-accent/30 bg-accent-soft text-accent-soft-foreground",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  COMPLETED: {
    className: "border-success/30 bg-success-soft text-success-foreground",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: {
    className: "border-destructive/30 bg-destructive-soft text-destructive",
    icon: CircleX,
    label: "Cancelled",
  },
};

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const {
    className,
    icon: Icon,
    label,
  } = appointmentStatusPresentation[status];

  return (
    <Badge
      className={`gap-1.5 font-mono text-[11px] font-semibold tracking-wide ${className}`}
      variant="outline"
    >
      <Icon aria-hidden className="size-3" />
      {label}
    </Badge>
  );
}

export { AppointmentStatusBadge };
