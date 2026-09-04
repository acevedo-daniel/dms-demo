export default function TreatmentsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading treatment catalog"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-end sm:justify-between animate-pulse">
        <div>
          <div className="h-3.5 w-48 rounded bg-secondary/80" />
          <div className="mt-3 h-9 w-40 rounded bg-secondary" />
          <div className="mt-2 h-4 w-96 rounded bg-secondary/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-28 rounded-full bg-secondary/70" />
          <div className="h-7 w-28 rounded-full bg-secondary/70" />
        </div>
      </div>

      <div className="mt-8 flex gap-2 animate-pulse overflow-x-auto pb-1">
        <div className="h-7 w-28 rounded-full bg-secondary" />
        <div className="h-7 w-32 rounded-full bg-secondary/70" />
        <div className="h-7 w-32 rounded-full bg-secondary/70" />
        <div className="h-7 w-32 rounded-full bg-secondary/70" />
      </div>

      <div className="mt-8 space-y-4 animate-pulse">
        <div className="h-6 w-36 rounded bg-secondary/80" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div
              className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-5 sm:flex-row sm:items-center sm:justify-between"
              key={item}
            >
              <div className="space-y-2">
                <div className="h-5 w-48 rounded bg-secondary" />
                <div className="h-4 w-80 max-w-full rounded bg-secondary/60" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-20 rounded-full bg-secondary/70" />
                <div className="h-9 w-24 rounded-md bg-secondary/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
