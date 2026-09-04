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

  const controls = (
    <>
      <div className="border-b border-border px-3 py-3">
        <p className="text-sm font-semibold text-foreground">{userName}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Demo workspace</p>
      </div>
      <div className="space-y-1 p-2">
        <AlertDialog onOpenChange={setIsResetOpen} open={isResetOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-start"
              disabled={isSignOutPending}
              variant="ghost"
            >
              <RotateCcw aria-hidden className="size-4" />
              Reset sample data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset sample data?</AlertDialogTitle>
              <AlertDialogDescription>
                This restores the curated Atelier Dental baseline and removes
                changes made in this demo session.
              </AlertDialogDescription>
            </AlertDialogHeader>
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
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isResetPending}
                onClick={(event) => {
                  event.preventDefault();
                  void resetSampleData();
                }}
              >
                <RotateCcw aria-hidden className="size-4" />
                {isResetPending ? "Resetting..." : "Reset sample data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          className="w-full justify-start"
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
        onClick={() => setIsMenuOpen((open) => !open)}
        size="icon"
        variant="ghost"
      >
        <MoreHorizontal aria-hidden className="size-5" />
      </Button>
      {isMenuOpen ? (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 z-30 w-72 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-raised shadow-[var(--shadow-raised)]">
          {controls}
        </div>
      ) : null}
    </div>
  );
}
