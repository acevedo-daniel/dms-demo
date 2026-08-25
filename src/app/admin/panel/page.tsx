"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarIcon,
  Activity,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { startOfDay, isToday } from "date-fns";

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  totalTreatments: number;
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}

export default function AdminPanel() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    totalTreatments: 0,
    totalRevenue: 0,
    loading: true,
    error: null,
  });
  // Cargar estadísticas desde las APIs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        // Cargar datos en paralelo
        const [patientsResponse, appointmentsResponse, treatmentsResponse] =
          await Promise.all([
            fetch("/api/pacientes"),
            fetch("/api/turnos"),
            fetch("/api/tratamientos"),
          ]);

        if (
          !patientsResponse.ok ||
          !appointmentsResponse.ok ||
          !treatmentsResponse.ok
        ) {
          throw new Error("Error al cargar las estadísticas");
        }

        const [patients, appointments, treatments] = await Promise.all([
          patientsResponse.json(),
          appointmentsResponse.json(),
          treatmentsResponse.json(),
        ]);

        // Calcular estadísticas
        const today = startOfDay(new Date());
        const todayAppointments = appointments.filter(
          (appointment: any) =>
            isToday(new Date(appointment.date)) &&
            appointment.client &&
            appointment.treatment,
        );

        const totalRevenue = treatments.reduce(
          (sum: number, treatment: any) => sum + treatment.cost,
          0,
        );

        setStats({
          totalPatients: patients.length,
          todayAppointments: todayAppointments.length,
          totalTreatments: treatments.length,
          totalRevenue,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Error al cargar las estadísticas",
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Cargando estadísticas...</span>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{stats.error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-primary/70 mt-2">
          Resumen general de la clínica dental
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pacientes
            </CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-white/80">Pacientes registrados</p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-gradient-to-br from-sky-500 to-sky-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <CalendarIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-white/80">Citas programadas</p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tratamientos</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTreatments}</div>
            <p className="text-xs text-white/80">Servicios disponibles</p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-white/80">Valor de tratamientos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="quick-action hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-primary flex items-center justify-between">
              Gestionar Pacientes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
            <CardDescription>
              Ver y administrar todos los pacientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/pacientes">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Users className="w-4 h-4 mr-2" />
                Ir a Pacientes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="quick-action hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-primary flex items-center justify-between">
              Calendario de Turnos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
            <CardDescription>Gestionar citas y horarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/turnos">
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="quick-action hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-primary flex items-center justify-between">
              Tratamientos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
            <CardDescription>Administrar servicios y precios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/tratamientos">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                <Activity className="w-4 h-4 mr-2" />
                Ver Tratamientos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
    </div>
  );
}
