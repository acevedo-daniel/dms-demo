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
    className: "border-primary/25 bg-accent text-primary",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  COMPLETED: {
    className: "border-[#166534]/25 bg-[#dcfce7] text-[#166534]",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: {
    className: "border-destructive/25 bg-[#fee4e2] text-destructive",
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
