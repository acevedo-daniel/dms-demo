"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-4 bottom-4 z-50 flex max-w-sm items-start gap-3 border border-border bg-card px-4 py-3 text-sm shadow-lg sm:right-6 sm:bottom-6"
      role="status"
    >
      <CheckCircle2
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-primary"
      />
      <p className="flex-1 leading-5">{message}</p>
      <Button
        aria-label="Dismiss notification"
        className="-mr-2 -mt-1 shrink-0"
        onClick={() => setMessage("")}
        size="icon"
        variant="ghost"
      >
        <X aria-hidden className="size-4" />
      </Button>
    </div>
  );
}
