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
import { formatDemoTime } from "@/lib/demo/format";
import { useI18n } from "@/lib/i18n";
import { getLocalizedClinicalAlert } from "@/lib/i18n/demo-content";
import { getLocalizedTreatment } from "@/lib/i18n/treatment-labels";

type HuddleAppointment = {
  id: string;
  patientId: string;
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
  const { locale } = useI18n();
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
        {locale === "es" ? "Informe diario" : "Daily huddle"}
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="daily-huddle-dialog max-h-[min(90vh,48rem)] max-w-3xl overflow-y-auto p-0">
          <div data-daily-huddle-print className="space-y-6 p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {locale === "es"
                  ? "Reunión clínica diaria"
                  : "Clinical daily huddle"}
              </DialogTitle>
              <DialogDescription>
                {locale === "es"
                  ? "Atelier Dental · informe operativo del día"
                  : "Atelier Dental · daily operational brief"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? "Turnos" : "Appointments"}
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {appointments.length}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? "En recepción" : "Arrived"}
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {
                    appointments.filter((item) => item.status === "ARRIVED")
                      .length
                  }
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">
                  {locale === "es" ? "Alertas" : "Alerts"}
                </p>
                <p className="mt-1 text-2xl font-semibold">{alertCount}</p>
              </div>
            </div>
            {alertCount ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <strong>
                  {locale === "es" ? "Alertas clínicas" : "Clinical alerts"}
                </strong>
                <ul className="mt-2 list-disc pl-5">
                  {appointments
                    .filter((item) => item.clinicalAlert)
                    .map((item) => (
                      <li key={item.id}>
                        {item.patientName}:{" "}
                        {getLocalizedClinicalAlert(
                          item.patientId,
                          item.clinicalAlert ?? "",
                          locale,
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
            <HuddleTable
              items={morning}
              label={locale === "es" ? "Mañana" : "Morning"}
              locale={locale}
            />
            <HuddleTable
              items={afternoon}
              label={locale === "es" ? "Tarde" : "Afternoon"}
              locale={locale}
            />
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
              <UsersRound aria-hidden className="size-4" />{" "}
              {locale === "es"
                ? "Dos sillones operativos · coordinar transición entre gabinetes."
                : "Two active operatories · coordinate chair handover."}
            </div>
            <div className="flex justify-end gap-2 print:hidden">
              <Button onClick={print}>
                <Printer aria-hidden className="size-4" />{" "}
                {locale === "es" ? "Imprimir" : "Print"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HuddleTable({
  items,
  label,
  locale,
}: {
  items: HuddleAppointment[];
  label: string;
  locale: "es" | "en";
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
              <th className="px-3 py-2">
                {locale === "es" ? "Horario" : "Time"}
              </th>
              <th className="px-3 py-2">
                {locale === "es" ? "Paciente" : "Patient"}
              </th>
              <th className="px-3 py-2">
                {locale === "es" ? "Tratamiento" : "Treatment"}
              </th>
              <th className="px-3 py-2">
                {locale === "es" ? "Sillón" : "Operatory"}
              </th>
              <th className="px-3 py-2">
                {locale === "es" ? "Estado" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 font-mono">
                    {formatDemoTime(new Date(item.startsAt), locale)}
                  </td>
                  <td className="px-3 py-2 font-medium">{item.patientName}</td>
                  <td className="px-3 py-2">
                    {
                      getLocalizedTreatment(
                        { name: item.treatmentName },
                        locale,
                      ).name
                    }
                  </td>
                  <td className="px-3 py-2">
                    {locale === "es"
                      ? `Sillón ${item.operatory}`
                      : `Operatory ${item.operatory}`}
                  </td>
                  <td className="px-3 py-2">
                    <AppointmentStatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-4 text-muted-foreground" colSpan={5}>
                  {locale === "es"
                    ? "Sin turnos programados."
                    : "No appointments scheduled."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
