"use client";

import { LogOut, MoreHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { announceWorkspaceFeedback } from "@/components/workspace-feedback";

type DemoUserControlsProps = {
  onActionComplete?: () => void;
  userName: string;
  variant?: "menu" | "sheet";
};

export function DemoUserControls({
  onActionComplete,
  userName,
  variant = "menu",
}: DemoUserControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isResetPending, setIsResetPending] = useState(false);
  const [isSignOutPending, setIsSignOutPending] = useState(false);

  useEffect(() => {
    if (!isMenuOpen || variant !== "menu") {
      return;
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        !isResetOpen &&
        !controlsRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen, isResetOpen, variant]);

  function completeAction() {
    setIsMenuOpen(false);
    onActionComplete?.();
  }

  async function resetSampleData() {
    setError(null);
    setIsResetPending(true);

    try {
      const response = await fetch("/api/demo/reset", {
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error();
      }

      setIsResetOpen(false);
      completeAction();
      announceWorkspaceFeedback("Sample data reset.");
      router.push("/demo/dashboard");
      router.refresh();
    } catch {
      setError("Sample data could not be reset. Try again.");
    } finally {
      setIsResetPending(false);
    }
  }

  async function signOut() {
    setError(null);
    setIsSignOutPending(true);

    try {
      const response = await fetch("/api/demo/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error();
      }

      completeAction();
      router.push("/demo/access");
      router.refresh();
    } catch {
      setError("The workspace could not be signed out. Try again.");
    } finally {
      setIsSignOutPending(false);
    }
  }

  const userInitials =
    userName
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "JS";

  const controls = (
    <>
      <div className="border-b border-border px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground/80">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground">
              Lead Practitioner · Atelier Dental
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-1 p-2">
        <AlertDialog onOpenChange={setIsResetOpen} open={isResetOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-start text-xs sm:text-sm"
              disabled={isSignOutPending}
              variant="ghost"
            >
              <RotateCcw aria-hidden className="size-4" />
              Reset sample data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground/80">
                  <RotateCcw aria-hidden className="size-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Practice Reset
                </span>
              </div>
              <AlertDialogTitle>Reset sample data?</AlertDialogTitle>
              <AlertDialogDescription>
                This restores the curated Atelier Dental baseline and removes
                changes made in this demo session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-[var(--radius-lg)] border border-border/70 bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong className="font-semibold text-foreground">
                  Session reset:
                </strong>{" "}
                Any new appointments, patient additions, or clinical notes
                created during this session will be restored to the clean
                practice baseline.
              </p>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isResetPending}>
                Keep current data
              </AlertDialogCancel>
              <AlertDialogAction
                className="dms-pressable rounded-full border border-destructive/20 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90 active:scale-[0.98]"
                disabled={isResetPending}
                onClick={(event) => {
                  event.preventDefault();
                  void resetSampleData();
                }}
              >
                <RotateCcw aria-hidden className="size-3.5" />
                {isResetPending ? "Resetting..." : "Reset sample data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          className="w-full justify-start text-xs sm:text-sm"
          disabled={isSignOutPending || isResetPending}
          onClick={signOut}
          variant="ghost"
        >
          <LogOut aria-hidden className="size-4" />
          {isSignOutPending ? "Signing out..." : "Sign out"}
        </Button>
        {error && !isResetOpen ? (
          <p
            className="px-3 pb-1 text-xs leading-5 text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </>
  );

  if (variant === "sheet") {
    return (
      <section aria-label="Demo controls" className="border-t border-border">
        {controls}
      </section>
    );
  }

  return (
    <div className="relative" ref={controlsRef}>
      <Button
        aria-expanded={isMenuOpen}
        aria-haspopup="dialog"
        aria-label="Open demo controls"
        className="h-9 gap-2 rounded-full border border-border/80 bg-background/50 px-2 sm:px-2.5 transition-colors hover:border-foreground/25 hover:bg-secondary/60"
        onClick={() => setIsMenuOpen((open) => !open)}
        variant="ghost"
      >
        <span className="flex size-6 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-semibold text-foreground/80">
          {userInitials}
        </span>
        <span className="hidden text-xs font-medium text-foreground xl:inline-block">
          {userName}
        </span>
        <MoreHorizontal aria-hidden className="size-4 text-muted-foreground" />
      </Button>
      {isMenuOpen ? (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 z-30 w-72 overflow-hidden rounded-[var(--radius-lg)] border border-border/80 bg-card/95 shadow-md backdrop-blur-xl">
          {controls}
        </div>
      ) : null}
    </div>
  );
}
