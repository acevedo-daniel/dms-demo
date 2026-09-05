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
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CommandPatient = {
  id: string;
  identifier: string;
  firstName: string;
  lastName: string;
};
type CommandTreatment = { id: string; name: string; category: string };

type NavigableItem = {
  href: string;
  icon: React.ReactNode;
  id: string;
  label: string;
  meta?: string;
};

const emptySubscribe = () => () => {};

export function CommandMenu({
  patients,
  treatments,
}: {
  patients: CommandPatient[];
  treatments: CommandTreatment[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const isMac = useSyncExternalStore(
    emptySubscribe,
    () =>
      typeof navigator !== "undefined" &&
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent),
    () => false,
  );
  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isK = event.key?.toLowerCase() === "k" || event.code === "KeyK";
      if ((event.metaKey || event.ctrlKey) && isK) {
        event.preventDefault();
        event.stopPropagation();
        setQuery("");
        setActiveIndex(0);
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
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

  const allEntries: NavigableItem[] = useMemo(() => {
    if (!normalized) {
      return [
        {
          href: "/demo/schedule?create=1",
          icon: <CalendarPlus aria-hidden className="size-4" />,
          id: "action-create-appointment",
          label: "New appointment",
          meta: "Schedule",
        },
        {
          href: "/demo/dashboard",
          icon: <CalendarDays aria-hidden className="size-4" />,
          id: "action-today",
          label: "Go to Today",
          meta: "Overview",
        },
        {
          href: "/demo/schedule",
          icon: <CalendarDays aria-hidden className="size-4" />,
          id: "action-schedule",
          label: "Open Schedule",
          meta: "Calendar",
        },
        {
          href: "/demo/patients",
          icon: <UsersRound aria-hidden className="size-4" />,
          id: "action-patients",
          label: "Open Patients",
          meta: "Directory",
        },
        {
          href: "/demo/patients?create=1",
          icon: <FilePlus2 aria-hidden className="size-4" />,
          id: "action-add-patient",
          label: "Add patient",
          meta: "New record",
        },
        {
          href: "/demo/notes?create=1",
          icon: <NotebookPen aria-hidden className="size-4" />,
          id: "action-log-note",
          label: "Log clinical note",
          meta: "Clinical",
        },
      ];
    }

    const patientEntries: NavigableItem[] = matchingPatients.map((item) => ({
      href: `/demo/patients/${item.id}`,
      icon: <UserRound aria-hidden className="size-4" />,
      id: `patient-${item.id}`,
      label: `${item.firstName} ${item.lastName}`,
      meta: item.identifier,
    }));

    const treatmentEntries: NavigableItem[] = matchingTreatments.map(
      (item) => ({
        href: `/demo/treatments?treatment=${item.id}`,
        icon: <ClipboardList aria-hidden className="size-4" />,
        id: `treatment-${item.id}`,
        label: item.name,
        meta: item.category,
      }),
    );

    return [...patientEntries, ...treatmentEntries];
  }, [matchingPatients, matchingTreatments, normalized]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!allEntries.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % allEntries.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + allEntries.length) % allEntries.length,
      );
    } else if (event.key === "Enter") {
      const selected = allEntries[activeIndex];
      if (selected) {
        event.preventDefault();
        setOpen(false);
        router.push(selected.href);
      }
    }
  }

  return (
    <>
      {/* Mobile / Tablet Compact Search Trigger */}
      <button
        aria-label={`Open command menu (${shortcutLabel})`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/70 text-muted-foreground shadow-2xs transition-colors hover:border-foreground/30 hover:bg-secondary/50 hover:text-foreground md:hidden"
        onClick={() => {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }}
        type="button"
      >
        <Search aria-hidden className="size-4" />
      </button>

      {/* Desktop / Laptop Command Capsule */}
      <button
        aria-label={`Open command menu (${shortcutLabel})`}
        className="hidden h-9 min-w-44 items-center justify-between gap-3 rounded-full border border-border/80 bg-background/70 px-3 text-left text-xs text-muted-foreground shadow-2xs transition-colors hover:border-foreground/30 hover:bg-secondary/40 hover:text-foreground md:flex lg:min-w-56"
        onClick={() => {
          setQuery("");
          setActiveIndex(0);
          setOpen(true);
        }}
        type="button"
      >
        <span className="flex items-center gap-2">
          <Search aria-hidden className="size-3.5 text-muted-foreground" />
          <span>Search workspace</span>
        </span>
        <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground/80">
          {shortcutLabel}
        </kbd>
      </button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-xl overflow-hidden p-0">
          <DialogHeader className="border-b border-border/80 px-5 py-4">
            <DialogTitle>Search workspace</DialogTitle>
            <DialogDescription>
              Jump to a patient, treatment, or common action.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoFocus
                aria-activedescendant={
                  allEntries[activeIndex]
                    ? `cmd-item-${activeIndex}`
                    : undefined
                }
                aria-autocomplete="list"
                aria-controls="cmd-listbox"
                aria-label="Search patients, treatments, and actions"
                className="h-10 pl-9 pr-4 text-sm"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search patients, treatments, or actions…"
                value={query}
              />
            </div>
            <div
              className="mt-3 max-h-80 space-y-1 overflow-y-auto"
              id="cmd-listbox"
              role="listbox"
            >
              {allEntries.map((entry, index) => (
                <CommandLink
                  href={entry.href}
                  icon={entry.icon}
                  id={`cmd-item-${index}`}
                  isActive={activeIndex === index}
                  key={entry.id}
                  label={entry.label}
                  meta={entry.meta}
                  onMouseEnter={() => setActiveIndex(index)}
                  onSelect={() => setOpen(false)}
                />
              ))}

              {normalized && !allEntries.length ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No matching workspace results.
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border/80 bg-secondary/80 px-1 py-0.5 font-mono text-[10px] text-foreground/80">
                  ↑
                </kbd>
                <kbd className="rounded border border-border/80 bg-secondary/80 px-1 py-0.5 font-mono text-[10px] text-foreground/80">
                  ↓
                </kbd>
                <span>to navigate</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
                  ↵
                </kbd>
                <span>to select</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border/80 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
                esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CommandLink({
  href,
  icon,
  id,
  isActive,
  label,
  meta,
  onMouseEnter,
  onSelect,
}: {
  href: string;
  icon: React.ReactNode;
  id: string;
  isActive: boolean;
  label: string;
  meta?: string;
  onMouseEnter: () => void;
  onSelect: () => void;
}) {
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <Link
      aria-selected={isActive}
      className={cn(
        "group flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors duration-100",
        isActive
          ? "bg-secondary font-medium text-foreground shadow-2xs"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
      href={href}
      id={id}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      ref={itemRef}
      role="option"
    >
      <span
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-accent" : "text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <span className="truncate font-medium">{label}</span>
      {meta ? (
        <span
          className={cn(
            "ml-auto shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors",
            isActive
              ? "border border-border/80 bg-background/80 font-medium text-foreground"
              : "bg-secondary/80 text-muted-foreground",
          )}
        >
          {meta}
        </span>
      ) : null}
    </Link>
  );
}
