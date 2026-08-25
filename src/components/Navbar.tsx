import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          DMS <span className="font-normal text-muted-foreground">/ Workspace</span>
        </Link>
        <span className="text-sm text-muted-foreground">Dental Management System</span>
      </div>
    </header>
  );
}
