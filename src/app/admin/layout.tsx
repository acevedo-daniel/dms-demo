"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarIcon,
  Activity,
  Settings,
  FileText,
  Menu,
  X,
  LogOut,
  Home, // ícono para ir a inicio
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/admin/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/patients", label: "Pacientes", icon: Users },
  { href: "/admin/appointments", label: "Turnos", icon: CalendarIcon },
  { href: "/admin/treatments", label: "Tratamientos", icon: Activity },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
  { href: "/admin/notes", label: "Notas", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-white shadow"
                    : "text-primary/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botones fijos abajo */}
        <div className="absolute bottom-4 left-0 right-0 p-4 flex flex-col gap-2">
          {/* Ir a inicio */}
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-primary hover:bg-primary/10"
            >
              <Home className="w-4 h-4" />
              Inicio
            </Button>
          </Link>

          {/* Cerrar sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center space-x-2"
          >
            <Menu className="w-5 h-5" />
            <span className="font-medium text-primary">Menú</span>
          </Button>
          <h1 className="text-lg font-semibold text-primary">Admin Panel</h1>
        </header>

        <main className="p-4 lg:p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
