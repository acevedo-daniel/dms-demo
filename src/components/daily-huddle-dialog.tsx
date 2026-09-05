"use client";

import { Printer, UsersRound } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge } from "@/components/appointment-status-badge";

type HuddleAppointment = {
  id: string;
  patientName: string;
  startsAt: string;
  treatmentName: string;
  status: "SCHEDULED" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "CANCELLED";
  operatory: number;
  clinicalAlert: string | null;
};

export function DailyHuddleDialog({
  appointments,
}: {
  appointments: HuddleAppointment[];
}) {
  const [open, setOpen] = useState(false);
  const morning = appointments.filter(
    (item) => new Date(item.startsAt).getUTCHours() < 15,
  );
  const afternoon = appointments.filter((item) => !morning.includes(item));
  const alertCount = appointments.filter((item) => item.clinicalAlert).length;
  const print = () => window.print();
  return (
    <>
      <Button
        className="h-10 px-4 font-semibold shadow-xs"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <Printer aria-hidden className="size-4" />
        Print daily huddle
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="daily-huddle-dialog max-h-[min(90vh,48rem)] max-w-3xl overflow-y-auto p-0">
          <div data-daily-huddle-print className="space-y-6 p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">Daily huddle</DialogTitle>
              <DialogDescription>
                Atelier Dental · operating brief for today
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Appointments</p>
                <p className="mt-1 text-2xl font-semibold">
                  {appointments.length}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Arrived</p>
                <p className="mt-1 text-2xl font-semibold">
                  {
                    appointments.filter((item) => item.status === "ARRIVED")
                      .length
                  }
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Alerts</p>
                <p className="mt-1 text-2xl font-semibold">{alertCount}</p>
              </div>
            </div>
            {alertCount ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <strong>Clinical alerts</strong>
                <ul className="mt-2 list-disc pl-5">
                  {appointments
                    .filter((item) => item.clinicalAlert)
                    .map((item) => (
                      <li key={item.id}>
                        {item.patientName}: {item.clinicalAlert}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
            <HuddleTable label="Morning" items={morning} />
            <HuddleTable label="Afternoon" items={afternoon} />
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
              <UsersRound aria-hidden className="size-4" /> Two operatories ·
              coordinate handoffs between chairs.
            </div>
            <div className="flex justify-end gap-2 print:hidden">
              <Button onClick={print}>
                <Printer aria-hidden className="size-4" /> Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HuddleTable({
  label,
  items,
}: {
  label: string;
  items: HuddleAppointment[];
}) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Patient</th>
              <th className="px-3 py-2">Treatment</th>
              <th className="px-3 py-2">Chair</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 font-mono">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "America/Argentina/Buenos_Aires",
                    }).format(new Date(item.startsAt))}
                  </td>
                  <td className="px-3 py-2 font-medium">{item.patientName}</td>
                  <td className="px-3 py-2">{item.treatmentName}</td>
                  <td className="px-3 py-2">Operatory {item.operatory}</td>
                  <td className="px-3 py-2">
                    <AppointmentStatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-4 text-muted-foreground" colSpan={5}>
                  No appointments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
