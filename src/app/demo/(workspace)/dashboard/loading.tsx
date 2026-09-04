function PlaceholderRow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid animate-pulse gap-4 py-5 sm:grid-cols-[5.25rem_minmax(0,1fr)_auto] sm:items-center">
      <div className="h-4 w-12 rounded bg-secondary" />
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-secondary" />
        <div className="h-3 w-44 rounded bg-secondary" />
      </div>
      {compact ? null : <div className="h-6 w-20 rounded bg-secondary" />}
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
      <div className="animate-pulse border-b border-border pb-7">
        <div className="h-3 w-28 rounded bg-secondary" />
        <div className="mt-4 h-9 w-40 rounded bg-secondary" />
        <div className="mt-3 h-4 w-48 rounded bg-secondary" />
      </div>
      <section className="pt-9">
        <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
        <div className="mt-5 divide-y divide-border border-y border-border">
          <PlaceholderRow />
          <PlaceholderRow />
          <PlaceholderRow />
        </div>
      </section>
      <div className="mt-10 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
        <section>
          <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
          <div className="mt-5 divide-y divide-border border-y border-border">
            <PlaceholderRow compact />
            <PlaceholderRow compact />
          </div>
        </section>
        <section>
          <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
          <div className="mt-5 divide-y divide-border border-y border-border">
            <PlaceholderRow compact />
            <PlaceholderRow compact />
          </div>
        </section>
      </div>
    </main>
  );
}
