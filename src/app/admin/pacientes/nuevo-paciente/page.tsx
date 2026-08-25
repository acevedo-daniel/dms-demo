"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Phone,
  Mail,
  Calendar,
  IdCard,
  Home,
  FileDigit,
  Loader2,
  Building2,
} from "lucide-react";

export default function NuevoPaciente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    dni: "",
    obraSocial: "",
    address: {
      street: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el paciente");
      }

      const newPatient = await response.json();
      console.log("Paciente creado:", newPatient);

      // Redirigir a la lista de pacientes
      router.push("/admin/pacientes");
    } catch (error) {
      console.error("Error creating patient:", error);
      setError(
        error instanceof Error ? error.message : "Error al crear el paciente",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-white">
      <section className="pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-primary mb-2">
                  Nuevo Paciente
                </h1>
                <p className="text-gray-800">Agregá los datos del paciente</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Nombre */}
                <div>
                  <Label htmlFor="name" className="text-primary font-medium">
                    Nombre
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nombre"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Apellido */}
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-primary font-medium"
                  >
                    Apellido
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Apellido"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* DNI */}
                <div>
                  <Label htmlFor="dni" className="text-primary font-medium">
                    DNI
                  </Label>
                  <div className="relative mt-1">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="dni"
                      name="dni"
                      type="text"
                      placeholder="DNI sin puntos"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.dni}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-primary font-medium"
                  >
                    Teléfono
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Teléfono"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <Label
                    htmlFor="birthDate"
                    className="text-primary font-medium"
                  >
                    Fecha de Nacimiento
                  </Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Obra Social */}
                <div>
                  <Label
                    htmlFor="obraSocial"
                    className="text-primary font-medium"
                  >
                    Obra Social{" "}
                    <span className="text-gray-500 text-sm">(Opcional)</span>
                  </Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="obraSocial"
                      name="obraSocial"
                      type="text"
                      placeholder="Ej: OSDE, Swiss Medical, Particular"
                      className="pl-10 border-primary/20 focus:border-primary"
                      value={formData.obraSocial}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Dirección - Calle */}
                <div>
                  <Label
                    htmlFor="address.street"
                    className="text-primary font-medium"
                  >
                    Dirección
                  </Label>
                  <div className="relative mt-1">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="address.street"
                      name="address.street"
                      type="text"
                      placeholder="Ej: Calle de demostración 123"
                      className="pl-10 border-primary/20 focus:border-primary"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Paciente"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
