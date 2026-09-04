export default function PatientsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading patient directory"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between animate-pulse">
        <div>
          <div className="h-3.5 w-44 rounded bg-secondary/80" />
          <div className="mt-3 h-9 w-36 rounded bg-secondary" />
          <div className="mt-2 h-4 w-80 rounded bg-secondary/60" />
        </div>
        <div className="h-10 w-32 rounded-md bg-secondary" />
      </div>

      <div className="mt-8 max-w-2xl animate-pulse space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-secondary/70" />
          <div className="h-3.5 w-16 rounded bg-secondary/50" />
        </div>
        <div className="h-11 w-full rounded-[var(--radius-md)] bg-secondary/60" />
      </div>

      <div className="mt-8 space-y-2.5 animate-pulse">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-4 sm:px-6 sm:py-5"
            key={item}
          >
            <div className="flex flex-1 items-center gap-4 sm:gap-6">
              <div className="size-10 shrink-0 rounded-full bg-secondary" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-secondary" />
                <div className="h-3 w-24 rounded bg-secondary/60" />
              </div>
            </div>
            <div className="hidden sm:block sm:w-40 space-y-2">
              <div className="h-3 w-20 rounded bg-secondary/50" />
              <div className="h-3.5 w-28 rounded bg-secondary/70" />
            </div>
            <div className="hidden sm:block sm:w-32 space-y-2">
              <div className="h-3 w-16 rounded bg-secondary/50" />
              <div className="h-3.5 w-24 rounded bg-secondary/70" />
            </div>
            <div className="size-4 rounded bg-secondary/40" />
          </div>
        ))}
      </div>
    </main>
  );
}
