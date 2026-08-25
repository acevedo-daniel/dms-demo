import { CalendarDays, ClipboardList, UsersRound } from "lucide-react";

const capabilities = [
  {
    icon: CalendarDays,
    title: "Scheduling",
    text: "Coordinate appointments with a clear, practical workflow.",
  },
  {
    icon: UsersRound,
    title: "Patient records",
    text: "Keep patient and treatment information organized in one place.",
  },
  {
    icon: ClipboardList,
    title: "Clinical workflow",
    text: "Follow treatment plans and notes with confidence.",
  },
];

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            DMS Workspace
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Dental Management System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A focused workspace for coordinating appointments, patient records,
            treatments, and clinical notes.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-medium text-card-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
