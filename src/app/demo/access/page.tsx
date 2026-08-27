import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemoAccessButton } from "@/components/demo-access-button";
import { DmsLogo } from "@/components/dms-logo";

export const metadata: Metadata = {
  title: "Open demo workspace",
  description: "Open the resettable DMS sample workspace.",
  robots: {
    follow: false,
    index: false,
  },
};

export default function DemoAccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 sm:px-6">
      <section
        aria-labelledby="demo-access-title"
        className="w-full max-w-xl border-y border-border py-10 sm:border sm:bg-card sm:p-10 sm:shadow-sm"
      >
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          href="/"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to case study
        </Link>
        <div className="mt-12">
          <DmsLogo />
          <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary">
            DMS · Atelier Dental
          </p>
          <h1
            className="mt-4 text-3xl font-semibold tracking-[-0.03em]"
            id="demo-access-title"
          >
            Open the demo workspace
          </h1>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">
            Explore a resettable sample workspace for a fictional practice. No
            account, password, or personal data is required.
          </p>
          <div className="mt-8">
            <DemoAccessButton />
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          Includes a daily dashboard, patient context, treatments, and
          operational notes built around one consistent workweek.
        </div>
      </section>
    </main>
  );
}
