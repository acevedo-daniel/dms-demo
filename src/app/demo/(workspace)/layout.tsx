import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { authorizeDemoRequest } from "@/lib/auth/authorization";
import { getPatientDirectory } from "@/lib/patients";
import { getTreatmentCatalog } from "@/lib/treatments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default async function DemoWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authorization = await authorizeDemoRequest(await headers());

  if (authorization.status !== "authorized") {
    redirect("/demo/access");
  }

  const [patients, treatments] = await Promise.all([
    getPatientDirectory(),
    getTreatmentCatalog(),
  ]);

  return (
    <WorkspaceShell
      commandData={{ patients, treatments }}
      userName={authorization.session.user.name}
    >
      {children}
    </WorkspaceShell>
  );
}
