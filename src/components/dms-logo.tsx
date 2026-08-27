import Image from "next/image";
import { cn } from "@/lib/utils";

type DmsLogoProps = {
  className?: string;
};

export function DmsLogo({ className }: DmsLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 overflow-hidden rounded-lg bg-accent",
        className,
      )}
    >
      <Image
        alt=""
        className="scale-[1.7] object-contain"
        fill
        loading="eager"
        sizes="40px"
        src="/dms-logo.png"
      />
    </span>
  );
}
