"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const workspaceFeedbackEvent = "dms:workspace-feedback";

export function announceWorkspaceFeedback(message: string) {
  window.dispatchEvent(
    new CustomEvent<string>(workspaceFeedbackEvent, { detail: message }),
  );
}

export function WorkspaceFeedback() {
  const [message, setMessage] = useState("");
  const timeoutId = useRef<number | undefined>(undefined);

  useEffect(() => {
    function showFeedback(event: Event) {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
        return;
      }

      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }

      setMessage(event.detail);
      timeoutId.current = window.setTimeout(() => setMessage(""), 5000);
    }

    window.addEventListener(workspaceFeedbackEvent, showFeedback);

    return () => {
      window.removeEventListener(workspaceFeedbackEvent, showFeedback);
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex max-w-md items-center gap-3 rounded-full border border-border/90 bg-popover/95 py-2 pr-2 pl-3 text-sm shadow-raised backdrop-blur-md transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-3 sm:right-6 sm:bottom-6"
      onFocus={() => {
        if (timeoutId.current) {
          window.clearTimeout(timeoutId.current);
          timeoutId.current = undefined;
        }
      }}
      onMouseEnter={() => {
        if (timeoutId.current) {
          window.clearTimeout(timeoutId.current);
          timeoutId.current = undefined;
        }
      }}
      role="status"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
        <CheckCircle2 aria-hidden className="size-4" />
      </div>
      <p className="flex-1 pr-1 text-xs font-semibold tracking-tight text-foreground sm:text-sm">
        {message}
      </p>
      <button
        aria-label="Dismiss notification"
        className="dms-pressable flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
        onClick={() => setMessage("")}
        type="button"
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
