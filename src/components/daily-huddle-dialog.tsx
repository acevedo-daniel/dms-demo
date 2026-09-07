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
  const print = () => {
    const printWindow = window.open("", "daily-huddle-print");

    if (!printWindow) return;

    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(
      getDailyHuddlePrintDocument({ appointments, locale }),
    );
    printWindow.document.close();

    window.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 0);
  };

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
        <DialogContent className="max-h-[min(90vh,48rem)] max-w-3xl overflow-y-auto p-0">
          <div className="space-y-6 p-6 sm:p-8">
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

function getDailyHuddlePrintDocument({
  appointments,
  locale,
}: {
  appointments: HuddleAppointment[];
  locale: "es" | "en";
}) {
  const morning = appointments.filter(
    (item) => new Date(item.startsAt).getUTCHours() < 15,
  );
  const afternoon = appointments.filter((item) => !morning.includes(item));
  const alertAppointments = appointments.filter((item) => item.clinicalAlert);
  const copy =
    locale === "es"
      ? {
          alerts: "Alertas",
          appointments: "Turnos",
          arrived: "En recepción",
          clinicalAlerts: "Alertas clínicas",
          footer:
            "Dos sillones operativos · Coordinar transición entre gabinetes.",
          morning: "Mañana",
          operatory: "Sillón",
          patient: "Paciente",
          subtitle: "Atelier Dental · informe operativo del día",
          time: "Horario",
          title: "Reunión clínica diaria",
          treatment: "Tratamiento",
          status: "Estado",
          noAppointments: "Sin turnos programados.",
        }
      : {
          alerts: "Alerts",
          appointments: "Appointments",
          arrived: "Arrived",
          clinicalAlerts: "Clinical alerts",
          footer: "Two active operatories · Coordinate chair handover.",
          morning: "Morning",
          operatory: "Operatory",
          patient: "Patient",
          subtitle: "Atelier Dental · daily operational brief",
          time: "Time",
          title: "Clinical daily huddle",
          treatment: "Treatment",
          status: "Status",
          noAppointments: "No appointments scheduled.",
        };

  const table = (items: HuddleAppointment[], label: string) => `
    <section>
      <h2>${escapeHtml(label)}</h2>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(copy.time)}</th>
            <th>${escapeHtml(copy.patient)}</th>
            <th>${escapeHtml(copy.treatment)}</th>
            <th>${escapeHtml(copy.operatory)}</th>
            <th>${escapeHtml(copy.status)}</th>
          </tr>
        </thead>
        <tbody>
          ${
            items.length
              ? items
                  .map(
                    (item) => `
                      <tr>
                        <td>${escapeHtml(formatDemoTime(new Date(item.startsAt), locale))}</td>
                        <td><strong>${escapeHtml(item.patientName)}</strong></td>
                        <td>${escapeHtml(getLocalizedTreatment({ name: item.treatmentName }, locale).name)}</td>
                        <td>${escapeHtml(`${copy.operatory} ${item.operatory}`)}</td>
                        <td>${escapeHtml(getLocalizedStatus(item.status, locale))}</td>
                      </tr>
                    `,
                  )
                  .join("")
              : `<tr><td class="empty" colspan="5">${escapeHtml(copy.noAppointments)}</td></tr>`
          }
        </tbody>
      </table>
    </section>
  `;

  return `<!doctype html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(copy.title)}</title>
        <style>
          @page { margin: 14mm; }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background: #fff; color: #171717; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.45; }
          main { max-width: 100%; overflow: visible; }
          header { border-bottom: 1px solid #d4d4d4; margin-bottom: 18pt; padding-bottom: 12pt; }
          h1 { font-size: 20pt; line-height: 1.15; margin: 0; }
          h2 { color: #525252; font-size: 9pt; letter-spacing: .08em; margin: 18pt 0 6pt; text-transform: uppercase; }
          p { margin: 0; }
          .subtitle, .footer { color: #525252; }
          .subtitle { margin-top: 4pt; }
          .summary { display: table; table-layout: fixed; border-collapse: separate; border-spacing: 8pt 0; margin: 0 -8pt; width: calc(100% + 16pt); }
          .metric { border: 1px solid #d4d4d4; border-radius: 6pt; display: table-cell; padding: 10pt; width: 33.333%; }
          .metric-label { color: #525252; font-size: 8pt; }
          .metric-value { font-size: 18pt; font-weight: 700; line-height: 1.1; margin-top: 4pt; }
          .alert { background: #fff7f7; border: 1px solid #f0b8b8; border-radius: 6pt; margin-top: 14pt; padding: 10pt; }
          .alert strong { display: block; }
          .alert ul { margin: 6pt 0 0; padding-left: 16pt; }
          section { break-inside: auto; overflow: visible; }
          table { border-collapse: collapse; table-layout: fixed; width: 100%; }
          th, td { border: 1px solid #d4d4d4; overflow-wrap: anywhere; padding: 7pt; text-align: left; vertical-align: top; }
          th { background: #f5f5f5; color: #525252; font-size: 8pt; font-weight: 600; }
          th:nth-child(1), td:nth-child(1) { width: 12%; }
          th:nth-child(2), td:nth-child(2) { width: 25%; }
          th:nth-child(3), td:nth-child(3) { width: 29%; }
          th:nth-child(4), td:nth-child(4) { width: 15%; }
          th:nth-child(5), td:nth-child(5) { width: 19%; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; page-break-inside: avoid; }
          .empty { color: #525252; text-align: center; }
          .footer { border-top: 1px solid #d4d4d4; margin-top: 18pt; padding-top: 10pt; }
        </style>
      </head>
      <body>
        <main>
          <header>
            <h1>${escapeHtml(copy.title)}</h1>
            <p class="subtitle">${escapeHtml(copy.subtitle)}</p>
          </header>
          <div class="summary">
            <div class="metric"><p class="metric-label">${escapeHtml(copy.appointments)}</p><p class="metric-value">${appointments.length}</p></div>
            <div class="metric"><p class="metric-label">${escapeHtml(copy.arrived)}</p><p class="metric-value">${appointments.filter((item) => item.status === "ARRIVED").length}</p></div>
            <div class="metric"><p class="metric-label">${escapeHtml(copy.alerts)}</p><p class="metric-value">${alertAppointments.length}</p></div>
          </div>
          ${
            alertAppointments.length
              ? `<aside class="alert"><strong>${escapeHtml(copy.clinicalAlerts)}</strong><ul>${alertAppointments
                  .map(
                    (item) =>
                      `<li><strong>${escapeHtml(item.patientName)}:</strong> ${escapeHtml(getLocalizedClinicalAlert(item.patientId, item.clinicalAlert ?? "", locale))}</li>`,
                  )
                  .join("")}</ul></aside>`
              : ""
          }
          ${table(morning, copy.morning)}
          ${table(afternoon, locale === "es" ? "Tarde" : "Afternoon")}
          <p class="footer">${escapeHtml(copy.footer)}</p>
        </main>
      </body>
    </html>`;
}

function getLocalizedStatus(
  status: HuddleAppointment["status"],
  locale: "es" | "en",
) {
  const labels = {
    es: {
      ARRIVED: "En recepción",
      CANCELLED: "Cancelado",
      COMPLETED: "Completado",
      CONFIRMED: "Confirmado",
      SCHEDULED: "Programado",
    },
    en: {
      ARRIVED: "Arrived",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
      CONFIRMED: "Confirmed",
      SCHEDULED: "Scheduled",
    },
  };

  return labels[locale][status];
}

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"]|'/g, (character) => {
    const entities: Record<string, string> = {
      '"': "&quot;",
      "&": "&amp;",
      "'": "&#039;",
      "<": "&lt;",
      ">": "&gt;",
    };

    return entities[character];
  });
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
