"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Treatment {
  _id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  category: string;
  createdAt: string;
}

export default function TratamientosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    cost: ""
  });
  const [updating, setUpdating] = useState(false);

  // Cargar tratamientos desde la API
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tratamientos');
        if (!response.ok) {
          throw new Error('Error al cargar los tratamientos');
        }
        const data = await response.json();
        setTreatments(data);
        setFilteredTreatments(data);
      } catch (error) {
        console.error('Error fetching treatments:', error);
        setError('Error al cargar los tratamientos');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".treatments-header",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".treatments-stats",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
    );

    gsap.fromTo(
      ".treatments-table",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const filtered = treatments.filter((treatment) =>
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTreatments(filtered);
  }, [searchTerm, treatments]);

  const totalTreatments = filteredTreatments.length;
  const totalRevenue = filteredTreatments.reduce(
    (acc, t) => acc + t.cost,
    0
  );
  const averageRevenue = totalTreatments > 0 ? totalRevenue / totalTreatments : 0;

  const handleEditTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setEditFormData({
      name: treatment.name,
      cost: treatment.cost.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/tratamientos/${editingTreatment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFormData.name,
          description: "Tratamiento dental",
          cost: parseFloat(editFormData.cost),
          duration: 30,
          category: "General"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el tratamiento');
      }

      const updatedTreatment = await response.json();
      
      // Actualizar la lista de tratamientos
      setTreatments(prev => prev.map(treatment => 
        treatment._id === updatedTreatment._id ? updatedTreatment : treatment
      ));
      setFilteredTreatments(prev => prev.map(treatment => 
        treatment._id === updatedTreatment._id ? updatedTreatment : treatment
      ));

      // Cerrar modal y limpiar formulario
      setIsEditModalOpen(false);
      setEditingTreatment(null);
      setEditFormData({ name: "", cost: "" });
    } catch (error) {
      console.error('Error updating treatment:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el tratamiento');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTreatment = async (treatmentId: string) => {
    try {
      const response = await fetch(`/api/tratamientos/${treatmentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el tratamiento');
      }
      
      // Actualizar la lista de tratamientos
      setTreatments(treatments.filter(treatment => treatment._id !== treatmentId));
      setFilteredTreatments(filteredTreatments.filter(treatment => treatment._id !== treatmentId));
    } catch (error) {
      console.error('Error deleting treatment:', error);
      setError('Error al eliminar el tratamiento');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Cargando tratamientos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="treatments-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Gestión de Tratamientos
          </h1>
          <p className="text-primary/70 mt-1">
            Total: {filteredTreatments.length} tratamientos
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          <Link href="/admin/tratamientos/nuevo-tratamiento">Nuevo Tratamiento</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="treatments-stats grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tratamientos
            </CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTreatments}</div>
            <p className="text-xs text-white/80">Servicios únicos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-white/80">Valor total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio por Tratamiento
            </CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(averageRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-white/80">Valor promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="treatments-header">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-4 h-4" />
            <Input
              placeholder="Buscar tratamiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Treatments Table */}
      <Card className="treatments-table">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Lista de Tratamientos
          </CardTitle>
          <CardDescription>
            Gestiona servicios, precios y estadísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tratamiento</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTreatments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-primary/50">
                      No se encontraron tratamientos
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTreatments.map((treatment) => (
                  <TableRow key={treatment._id} className="hover:bg-primary/5">
                    <TableCell>
                      <div className="font-medium text-primary">
                        {treatment.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {treatment.description}
                      </div>
                    </TableCell>
                   
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-emerald-600" />
                        <span className="font-medium">${treatment.cost.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-primary/10 bg-transparent"
                          onClick={() => handleEditTreatment(treatment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-bold text-primary text-xl">
                                ¿Estás seguro de eliminar este tratamiento?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el tratamiento <span className="text-primary text-md font-semibold">{treatment.name}</span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTreatment(treatment._id)}>
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Edición de Tratamiento */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-primary mb-4">Editar Tratamiento</h2>
            
            <form onSubmit={handleUpdateTreatment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Tratamiento
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editFormData.cost}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingTreatment(null);
                    setEditFormData({ name: "", cost: "" });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Tratamiento'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
