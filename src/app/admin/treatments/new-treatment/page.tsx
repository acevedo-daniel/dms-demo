"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, DollarSign, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NuevoTratamiento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/treatments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: "Tratamiento dental",
          cost: parseFloat(formData.cost),
          duration: 30,
          category: "General",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el tratamiento");
      }

      const newTreatment = await response.json();
      console.log("Tratamiento creado:", newTreatment);
      router.push("/admin/treatments");
    } catch (error) {
      console.error("Error creating treatment:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al crear el tratamiento",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-white">
      <section className="pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-primary mb-2">
                  Nuevo Tratamiento
                </h1>
                <p className="text-gray-800">Agregá un nuevo tratamiento</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del Tratamiento */}
                <div>
                  <Label htmlFor="name" className="text-primary font-medium">
                    Nombre del Tratamiento
                  </Label>
                  <div className="relative mt-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ej: Limpieza dental, Ortodoncia, Implante"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Precio del Tratamiento */}
                <div>
                  <Label htmlFor="cost" className="text-primary font-medium">
                    Precio ($)
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-10 border-primary/20 focus:border-primary"
                      required
                      value={formData.cost}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Botones */}
                <div className="flex space-x-3">
                  <Link href="/admin/treatments" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Tratamiento"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
