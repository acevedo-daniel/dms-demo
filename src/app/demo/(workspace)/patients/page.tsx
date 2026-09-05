import { PatientDirectory } from "@/components/patient-directory";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPatientDirectory } from "@/lib/patients";

async function loadPatientDirectory() {
  try {
    return await getPatientDirectory();
  } catch {
    return null;
  }
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const parameters = await searchParams;
  const patients = await loadPatientDirectory();

  if (!patients) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="patient-directory-error-title"
          className="max-w-lg border-y border-border py-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patient directory
          </p>
          <h1
            className="mt-3 text-3xl font-semibold tracking-[-0.03em]"
            id="patient-directory-error-title"
          >
            The patient directory could not be loaded.
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            The sample data is temporarily unavailable. Try again.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/demo/patients">Try again</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PatientDirectory
        initialCreate={parameters.create === "1"}
        initialPatients={patients}
      />
    </main>
  );
}
