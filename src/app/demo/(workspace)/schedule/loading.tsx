export default function ScheduleLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse border-b border-border pb-7">
        <div className="h-3 w-36 rounded bg-secondary" />
        <div className="mt-4 h-9 w-32 rounded bg-secondary" />
        <div className="mt-3 h-4 w-48 rounded bg-secondary" />
      </div>
      <div className="mt-8 h-[48rem] border border-border bg-secondary" />
    </main>
  );
}
