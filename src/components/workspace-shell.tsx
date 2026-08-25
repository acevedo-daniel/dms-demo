"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  UsersRound,
} from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkspaceFeedback } from "@/components/workspace-feedback";
import { cn } from "@/lib/utils";

type WorkspaceShellProps = {
  children: ReactNode;
  userName: string;
};

type NavigationItem = {
  disabled?: boolean;
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
};

const navigationItems: NavigationItem[] = [
  { href: "/demo/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/demo/schedule", icon: CalendarDays, label: "Schedule" },
  {
    href: "/demo/patients",
    icon: UsersRound,
    label: "Patients",
  },
  { href: "/demo/treatments", icon: ClipboardList, label: "Treatments" },
  { href: "/demo/notes", icon: NotebookPen, label: "Notes" },
];

function DmsMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 place-items-center rounded-lg bg-primary font-mono text-base font-semibold text-primary-foreground"
    >
      D
    </span>
  );
}

function WorkspaceNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace navigation" className="space-y-1">
      {navigationItems.map(({ disabled, href, icon: Icon, label }) => {
        const active = pathname === href;
        const className = cn(
          "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
          active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          disabled &&
            "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-muted-foreground",
        );

        if (disabled) {
          return (
            <span
              aria-disabled="true"
              className={className}
              key={href}
              title="Available in the next workspace slice"
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </span>
          );
        }

        return (
          <Link
            className={className}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/demo/logout", { method: "POST" });
    router.push("/demo/access");
    router.refresh();
  }

  return (
    <Button
      className="w-full justify-start text-muted-foreground hover:text-foreground"
      onClick={signOut}
      variant="ghost"
    >
      <LogOut aria-hidden className="size-4" />
      Sign out
    </Button>
  );
}

export function WorkspaceShell({ children, userName }: WorkspaceShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background xl:grid xl:grid-cols-[15.5rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-card xl:flex xl:min-h-screen xl:flex-col">
        <div className="border-b border-border px-5 py-5">
          <Link className="flex items-center gap-3" href="/demo/dashboard">
            <DmsMark />
            <span>
              <span className="block text-sm font-semibold tracking-tight">
                DMS
              </span>
              <span className="block text-xs text-muted-foreground">
                Atelier Dental
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 px-3 py-5">
          <WorkspaceNavigation />
        </div>

        <div className="border-t border-border p-3">
          <p className="px-3 pb-2 text-xs text-muted-foreground">{userName}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur xl:px-8">
          <div className="flex items-center gap-3">
            <Dialog onOpenChange={setIsNavigationOpen} open={isNavigationOpen}>
              <DialogTrigger asChild>
                <Button
                  aria-label="Open workspace navigation"
                  className="xl:hidden"
                  size="icon"
                  variant="ghost"
                >
                  <Menu aria-hidden className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="top-0 right-0 left-auto h-dvh w-[min(20rem,calc(100%-2rem))] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 p-0 sm:max-w-none">
                <DialogHeader className="border-b border-border p-5 text-left">
                  <DialogTitle className="flex items-center gap-3">
                    <DmsMark />
                    <span>
                      <span className="block text-sm font-semibold">DMS</span>
                      <span className="block pt-0.5 text-xs font-normal text-muted-foreground">
                        Atelier Dental
                      </span>
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="p-3">
                  <WorkspaceNavigation
                    onNavigate={() => setIsNavigationOpen(false)}
                  />
                </div>
                <div className="mt-auto border-t border-border p-3">
                  <p className="px-3 pb-2 text-xs text-muted-foreground">
                    {userName}
                  </p>
                  <SignOutButton />
                </div>
              </DialogContent>
            </Dialog>
            <Link
              className="flex items-center gap-2 xl:hidden"
              href="/demo/dashboard"
            >
              <DmsMark />
              <span className="text-sm font-semibold">DMS</span>
            </Link>
          </div>
          <span className="text-sm text-muted-foreground">Demo workspace</span>
        </header>
        {children}
      </div>
      <WorkspaceFeedback />
    </div>
  );
}
