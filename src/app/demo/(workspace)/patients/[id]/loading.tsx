export default function PatientLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading patient record"
      className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="h-8 w-24 rounded-full bg-secondary/80" />

      <div className="mt-4 border-b border-border/80 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="h-3.5 w-44 rounded bg-secondary/80" />
            <div className="mt-4 flex items-center gap-4">
              <div className="size-14 rounded-full bg-secondary" />
              <div className="space-y-2">
                <div className="h-9 w-64 rounded bg-secondary" />
                <div className="h-4 w-48 rounded bg-secondary/60" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-36 rounded-md bg-secondary" />
            <div className="h-10 w-20 rounded-md bg-secondary/80" />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-secondary/70" />
          <div className="h-6 w-32 rounded-full bg-secondary/60" />
          <div className="h-6 w-36 rounded-full bg-secondary/60" />
        </div>
      </div>

      <div className="grid gap-6 border-b border-border/80 py-8 md:grid-cols-2">
        <div className="h-44 rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-6" />
        <div className="h-44 rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-6" />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-28 rounded bg-secondary/80" />
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-full bg-secondary" />
            <div className="h-7 w-28 rounded-full bg-secondary/70" />
            <div className="h-7 w-20 rounded-full bg-secondary/70" />
          </div>
        </div>

        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-24 rounded-[var(--radius-lg)] border border-border/60 bg-card/30 p-5"
              key={item}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
