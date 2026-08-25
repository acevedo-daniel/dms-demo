import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { authorizeDemoRequest } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

export default async function DemoWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authorization = await authorizeDemoRequest(await headers());

  if (authorization.status !== "authorized") {
    redirect("/demo/access");
  }

  return (
    <WorkspaceShell userName={authorization.session.user.name}>
      {children}
    </WorkspaceShell>
  );
}
