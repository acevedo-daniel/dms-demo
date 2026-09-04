export default function NotesLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading patient notes"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between animate-pulse">
        <div>
          <div className="h-3.5 w-44 rounded bg-secondary/80" />
          <div className="mt-3 h-9 w-32 rounded bg-secondary" />
          <div className="mt-2 h-4 w-96 rounded bg-secondary/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <div className="h-7 w-28 rounded-full bg-secondary/70" />
            <div className="h-7 w-24 rounded-full bg-secondary/70" />
          </div>
          <div className="h-10 w-28 rounded-md bg-secondary" />
        </div>
      </div>

      <div className="mt-8 max-w-2xl animate-pulse space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-secondary/70" />
          <div className="h-3.5 w-16 rounded bg-secondary/50" />
        </div>
        <div className="h-11 w-full rounded-[var(--radius-md)] bg-secondary/60" />
      </div>

      <div className="mt-8 space-y-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <div className="h-4 w-36 rounded bg-secondary/70" />
          <div className="h-px flex-1 bg-border/60" />
        </div>

        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              className="rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-5"
              key={item}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="size-9 rounded-full bg-secondary" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-32 rounded bg-secondary" />
                      <div className="h-4 w-24 rounded-full bg-secondary/60" />
                    </div>
                    <div className="h-3 w-16 rounded bg-secondary/50" />
                  </div>
                </div>
                <div className="h-8 w-14 rounded bg-secondary/60" />
              </div>
              <div className="mt-3.5 h-16 rounded-[var(--radius-md)] bg-secondary/40" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
