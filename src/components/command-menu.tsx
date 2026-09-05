"use client";

import {
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  FilePlus2,
  NotebookPen,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type CommandPatient = {
  id: string;
  identifier: string;
  firstName: string;
  lastName: string;
};
type CommandTreatment = { id: string; name: string; category: string };

export function CommandMenu({
  patients,
  treatments,
}: {
  patients: CommandPatient[];
  treatments: CommandTreatment[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuery("");
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const normalized = query.trim().toLowerCase();
  const matchingPatients = useMemo(
    () =>
      patients
        .filter((item) =>
          `${item.firstName} ${item.lastName} ${item.identifier}`
            .toLowerCase()
            .includes(normalized),
        )
        .slice(0, 5),
    [normalized, patients],
  );
  const matchingTreatments = useMemo(
    () =>
      treatments
        .filter((item) =>
          `${item.name} ${item.category}`.toLowerCase().includes(normalized),
        )
        .slice(0, 5),
    [normalized, treatments],
  );
  return (
    <>
      <button
        aria-label="Open command menu"
        className="hidden h-9 min-w-56 items-center justify-between gap-3 rounded-md border border-border/80 bg-background/70 px-3 text-left text-xs text-muted-foreground shadow-xs transition-colors hover:border-foreground/30 hover:text-foreground lg:flex"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        type="button"
      >
        <span className="flex items-center gap-2">
          <Search aria-hidden className="size-3.5" />
          Search workspace
        </span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Search workspace</DialogTitle>
            <DialogDescription>
              Jump to a patient, treatment, or common action.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <Input
              autoFocus
              aria-label="Search patients, treatments, and actions"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patients, treatments, or actions…"
              value={query}
            />
            <div
              className="mt-3 max-h-80 space-y-1 overflow-y-auto"
              role="listbox"
            >
              {!normalized ? (
                <>
                  <CommandLink
                    href="/demo/schedule?create=1"
                    icon={<CalendarPlus aria-hidden className="size-4" />}
                    label="New appointment"
                    onSelect={() => setOpen(false)}
                  />
                  <CommandLink
                    href="/demo/dashboard"
                    icon={<CalendarDays aria-hidden className="size-4" />}
                    label="Go to Today"
                    onSelect={() => setOpen(false)}
                  />
                  <CommandLink
                    href="/demo/schedule"
                    icon={<CalendarDays aria-hidden className="size-4" />}
                    label="Open Schedule"
                    onSelect={() => setOpen(false)}
                  />
                  <CommandLink
                    href="/demo/patients"
                    icon={<UsersRound aria-hidden className="size-4" />}
                    label="Open Patients"
                    onSelect={() => setOpen(false)}
                  />
                  <CommandLink
                    href="/demo/patients?create=1"
                    icon={<FilePlus2 aria-hidden className="size-4" />}
                    label="Add patient"
                    onSelect={() => setOpen(false)}
                  />
                  <CommandLink
                    href="/demo/notes?create=1"
                    icon={<NotebookPen aria-hidden className="size-4" />}
                    label="Log clinical note"
                    onSelect={() => setOpen(false)}
                  />
                </>
              ) : null}
              {matchingPatients.map((item) => (
                <CommandLink
                  key={item.id}
                  href={`/demo/patients/${item.id}`}
                  icon={<UserRound aria-hidden className="size-4" />}
                  label={`${item.firstName} ${item.lastName}`}
                  meta={item.identifier}
                  onSelect={() => setOpen(false)}
                />
              ))}
              {matchingTreatments.map((item) => (
                <CommandLink
                  key={item.id}
                  href={`/demo/treatments?treatment=${item.id}`}
                  icon={<ClipboardList aria-hidden className="size-4" />}
                  label={item.name}
                  meta={item.category}
                  onSelect={() => setOpen(false)}
                />
              ))}
              {normalized &&
              !matchingPatients.length &&
              !matchingTreatments.length ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No matching workspace results.
                </p>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CommandLink({
  href,
  icon,
  label,
  meta,
  onSelect,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  meta?: string;
  onSelect: () => void;
}) {
  return (
    <Link
      className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
      href={href}
      onClick={onSelect}
      role="option"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{label}</span>
      {meta ? (
        <span className="ml-auto text-xs text-muted-foreground">{meta}</span>
      ) : null}
    </Link>
  );
}
