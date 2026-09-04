export default function ScheduleLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading schedule"
      className="mx-auto w-full max-w-[var(--schedule-workspace-max)] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="animate-pulse border-b border-border/80 pb-8">
        <div className="h-3 w-40 rounded bg-secondary/80" />
        <div className="mt-4 h-9 w-36 rounded bg-secondary/80" />
        <div className="mt-3 h-4 w-56 rounded bg-secondary/60" />
      </div>

      <div className="mt-8 hidden overflow-hidden rounded-[var(--radius-lg)] border border-border/80 bg-card/30 md:block">
        <div className="grid grid-cols-[4.5rem_repeat(5,1fr)] border-b border-border/80 p-4">
          <div className="h-4 w-8 rounded bg-secondary/80" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div className="h-4 w-24 rounded bg-secondary/80" key={i} />
          ))}
        </div>
        <div className="grid h-[38rem] grid-cols-[4.5rem_repeat(5,1fr)] divide-x divide-border/60">
          <div className="space-y-8 p-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div className="h-3 w-8 rounded bg-secondary/60" key={i} />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((col) => (
            <div className="space-y-4 p-2" key={col}>
              {col % 2 === 0 ? (
                <div className="h-16 rounded-[var(--radius-md)] bg-secondary/50" />
              ) : null}
              {col === 1 ? (
                <div className="mt-20 h-24 rounded-[var(--radius-md)] bg-secondary/50" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-2 border-y border-border/80 py-4 md:hidden">
        <div className="h-12 rounded-[var(--radius-lg)] bg-secondary/60" />
        {[0, 1, 2, 3].map((item) => (
          <div
            className="h-16 rounded-[var(--radius-md)] bg-secondary/40"
            key={item}
          />
        ))}
      </div>
    </main>
  );
}
