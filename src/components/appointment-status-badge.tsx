import { CheckCircle2, CircleX, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const appointmentStatusPresentation: Record<
  AppointmentStatus,
  { className: string; icon: typeof Clock3; label: string }
> = {
  SCHEDULED: {
    className: "border-input bg-card text-muted-foreground",
    icon: Clock3,
    label: "Scheduled",
  },
  CONFIRMED: {
    className: "border-accent/25 bg-accent-soft text-accent-soft-foreground",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  COMPLETED: {
    className: "border-success/25 bg-success-soft text-success-foreground",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: {
    className: "border-destructive/25 bg-destructive-soft text-destructive",
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
    <Badge className={className} variant="outline">
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}

export { AppointmentStatusBadge };
