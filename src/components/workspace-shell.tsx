"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Menu,
  NotebookPen,
  UsersRound,
} from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { DemoUserControls } from "@/components/demo-user-controls";
import { CommandMenu } from "@/components/command-menu";
import { DmsLogo } from "@/components/dms-logo";
import { NavigationSheet } from "@/components/navigation-sheet";
import { StudioControls } from "@/components/studio-controls";
import { Button } from "@/components/ui/button";
import { WorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";

type WorkspaceShellProps = {
  commandData: {
    patients: Array<{
      id: string;
      identifier: string;
      firstName: string;
      lastName: string;
    }>;
    treatments: Array<{ id: string; name: string; category: string }>;
  };
  children: ReactNode;
  userName: string;
};

type NavigationItem = {
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
};

const navigationItems: NavigationItem[] = [
  { href: "/demo/dashboard", icon: LayoutDashboard, label: "Today" },
  { href: "/demo/schedule", icon: CalendarDays, label: "Schedule" },
  { href: "/demo/patients", icon: UsersRound, label: "Patients" },
  { href: "/demo/treatments", icon: ClipboardList, label: "Treatments" },
  { href: "/demo/notes", icon: NotebookPen, label: "Notes" },
];

function workspacePageTitle(pathname: string) {
  if (pathname.startsWith("/demo/patients/")) {
    return "Patient record";
  }

  return navigationItems.find((item) => item.href === pathname)?.label ?? "DMS";
}

function isNavigationItemActive(item: NavigationItem, pathname: string) {
  return (
    pathname === item.href ||
    (item.href === "/demo/patients" && pathname.startsWith("/demo/patients/"))
  );
}

function WorkspaceNavigation({
  onNavigate,
  variant,
}: {
  onNavigate?: () => void;
  variant: "desktop" | "sheet";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Workspace navigation"
      className={cn(
        variant === "desktop"
          ? "flex h-full items-stretch gap-1"
          : "space-y-1 p-3",
      )}
    >
      {navigationItems.map((item) => {
        const { href, icon: Icon, label } = item;
        const active = isNavigationItemActive(item, pathname);
        const className = cn(
          "dms-pressable relative inline-flex items-center gap-2 text-sm",
          variant === "desktop"
            ? "h-full px-3 font-medium text-muted-foreground hover:translate-y-0 hover:text-foreground active:scale-100"
            : "min-h-[var(--touch-target-min)] w-full rounded-[var(--radius-sm)] px-3 font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
          active &&
            (variant === "desktop"
              ? "font-semibold text-foreground after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:bg-accent"
              : "border-l-2 border-accent bg-secondary font-semibold text-foreground"),
        );

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={className}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            {variant === "sheet" ? (
              <Icon aria-hidden className="size-4" />
            ) : null}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function WorkspaceShell({
  children,
  commandData,
  userName,
}: WorkspaceShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = workspacePageTitle(pathname);
  const hasCompactCreateAction =
    pathname === "/demo/dashboard" || pathname === "/demo/schedule";

  return (
    <div className="min-h-screen bg-background">
      <header
        aria-label="DMS workspace header"
        className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[var(--content-max)] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex h-full min-w-0 items-center gap-2 lg:gap-7">
            <Button
              aria-label="Open workspace navigation"
              className="lg:hidden"
              onClick={() => setIsNavigationOpen(true)}
              size="icon"
              variant="ghost"
            >
              <Menu aria-hidden className="size-5" />
            </Button>
            <Link
              className="dms-pressable flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] lg:gap-3"
              href="/demo/dashboard"
            >
              <DmsLogo className="size-8 lg:size-9" />
              <span>
                <span className="block text-sm font-semibold tracking-tight">
                  DMS
                </span>
                <span className="hidden pt-0.5 text-xs text-muted-foreground lg:block">
                  Atelier Dental
                </span>
              </span>
            </Link>
            <span className="truncate text-sm font-semibold text-foreground lg:hidden">
              {pageTitle}
            </span>
            <div className="hidden h-full lg:block">
              <WorkspaceNavigation variant="desktop" />
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <CommandMenu {...commandData} />
            {hasCompactCreateAction ? (
              <Button asChild className="px-3 text-xs lg:hidden" size="sm">
                <Link
                  aria-label="Create appointment"
                  href="/demo/schedule?create=1"
                >
                  <CalendarPlus aria-hidden className="size-4" />
                  Create
                </Link>
              </Button>
            ) : null}
            <StudioControls className="hidden sm:inline-flex" />
            <div className="hidden lg:block">
              <DemoUserControls userName={userName} />
            </div>
          </div>
        </div>
      </header>
      <NavigationSheet
        onOpenChange={setIsNavigationOpen}
        open={isNavigationOpen}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <WorkspaceNavigation
            onNavigate={() => setIsNavigationOpen(false)}
            variant="sheet"
          />
          <div className="mt-auto space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferences
              </span>
              <StudioControls />
            </div>
            <DemoUserControls
              onActionComplete={() => setIsNavigationOpen(false)}
              userName={userName}
              variant="sheet"
            />
          </div>
        </div>
      </NavigationSheet>
      {children}
      <WorkspaceFeedback />
    </div>
  );
}
