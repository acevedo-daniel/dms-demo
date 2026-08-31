import { cn } from "@/lib/utils";

type DmsLogoProps = {
  className?: string;
};

export function DmsLogo({ className }: DmsLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <span className="font-sans text-[0.95rem] leading-none font-semibold tracking-[-0.12em]">
        D
      </span>
    </span>
  );
}
