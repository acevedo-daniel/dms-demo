export default function PatientLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-11 w-28 rounded bg-secondary" />
      <div className="mt-4 border-b border-border pb-7">
        <div className="h-3 w-28 rounded bg-secondary" />
        <div className="mt-4 h-9 w-64 rounded bg-secondary" />
        <div className="mt-3 h-4 w-56 rounded bg-secondary" />
      </div>
      <div className="mt-6 h-24 border-y border-border bg-secondary" />
      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2 border-y border-border py-2">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-20 rounded bg-secondary" key={item} />
          ))}
        </div>
        <div className="h-56 border-y border-border bg-secondary" />
      </div>
    </main>
  );
}
