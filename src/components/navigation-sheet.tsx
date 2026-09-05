"use client";

import { type ReactNode } from "react";
import { X } from "lucide-react";
import { DmsLogo } from "@/components/dms-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NavigationSheetProps = {
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function NavigationSheet({
  children,
  onOpenChange,
  open,
}: NavigationSheetProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="top-0 right-0 left-auto flex h-dvh w-[min(22rem,calc(100%-1rem))] max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-y-0 border-r-0 p-0 sm:max-w-none"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-border p-5 text-left">
          <DialogTitle className="flex items-center gap-3">
            <DmsLogo className="size-9" />
            <span>
              <span className="block text-sm font-semibold tracking-tight">
                DMS
              </span>
              <span className="block pt-0.5 text-xs font-normal text-muted-foreground">
                Atelier Dental
              </span>
            </span>
          </DialogTitle>
          <Button
            aria-label="Close workspace navigation"
            onClick={() => onOpenChange(false)}
            size="icon"
            variant="ghost"
          >
            <X aria-hidden className="size-5" />
          </Button>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
