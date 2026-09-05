function PlaceholderRow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid animate-pulse gap-3 py-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center">
      <div className="h-4 w-12 rounded bg-secondary/80" />
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-secondary/80" />
        <div className="h-3 w-44 rounded bg-secondary/60" />
      </div>
      {compact ? null : (
        <div className="h-6 w-20 rounded-full bg-secondary/70" />
      )}
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading Today"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="animate-pulse border-b border-border/80 pb-8">
        <div className="h-3 w-32 rounded bg-secondary/80" />
        <div className="mt-4 h-9 w-36 rounded bg-secondary/80" />
        <div className="mt-3 h-4 w-52 rounded bg-secondary/60" />
      </div>

      <section className="pt-8">
        <div className="animate-pulse rounded-[var(--radius-lg)] border border-border/70 border-l-4 border-l-primary/30 bg-card/40 p-6 sm:p-7">
          <div className="h-3 w-20 rounded bg-secondary/80" />
          <div className="mt-4 flex items-center gap-3">
            <div className="h-7 w-20 rounded bg-secondary/80" />
            <div className="size-7 rounded-full bg-secondary/70" />
            <div className="h-6 w-36 rounded bg-secondary/80" />
          </div>
          <div className="mt-3 h-4 w-48 rounded bg-secondary/60" />
        </div>
      </section>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,.8fr)]">
        <section>
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="h-5 w-32 rounded bg-secondary/80" />
            <div className="h-5 w-16 rounded-full bg-secondary/70" />
          </div>
          <div className="mt-4 divide-y divide-border/60 border-y border-border/80">
            <PlaceholderRow />
            <PlaceholderRow />
            <PlaceholderRow />
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border/80 bg-card/40 p-5 sm:p-6">
          <div className="border-b border-border/60 pb-3">
            <div className="h-3 w-24 rounded bg-secondary/80" />
            <div className="mt-2 h-5 w-28 rounded bg-secondary/80" />
          </div>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-secondary/80" />
              <div className="h-3 w-36 rounded bg-secondary/60" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-secondary/80" />
              <div className="h-3 w-40 rounded bg-secondary/60" />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-14 border-t border-border/80 pt-10">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 rounded bg-secondary/80" />
          <div className="h-7 w-20 rounded bg-secondary/70" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-32 rounded-[var(--radius-md)] border border-border/60 bg-card/40 p-4" />
          <div className="h-32 rounded-[var(--radius-md)] border border-border/60 bg-card/40 p-4" />
          <div className="h-32 rounded-[var(--radius-md)] border border-border/60 bg-card/40 p-4" />
        </div>
      </section>
    </main>
  );
}
