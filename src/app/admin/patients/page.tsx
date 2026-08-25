"use client";

import { useState, useEffect } from "react";
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
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  IdCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

interface Patient {
  _id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dni: string;
  birthDate: string;
  obraSocial?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt: string;
}

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    lastName: "",
    dni: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    obraSocial: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
  const [updating, setUpdating] = useState(false);

  // Cargar pacientes desde la API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/patients");
        if (!response.ok) {
          throw new Error("Error al cargar los pacientes");
        }
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Error al cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.email &&
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        patient.phoneNumber.includes(searchTerm) ||
        patient.dni.includes(searchTerm),
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setEditFormData({
      name: patient.name,
      lastName: patient.lastName,
      dni: patient.dni,
      phoneNumber: patient.phoneNumber,
      email: patient.email || "",
      birthDate: patient.birthDate
        ? new Date(patient.birthDate).toISOString().split("T")[0]
        : "",
      obraSocial: patient.obraSocial || "",
      address: {
        street: patient.address?.street || "",
        city: patient.address?.city || "",
        state: patient.address?.state || "",
        zipCode: patient.address?.zipCode || "",
      },
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/patients/${editingPatient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editFormData.name,
          lastName: editFormData.lastName,
          dni: editFormData.dni,
          phoneNumber: editFormData.phoneNumber,
          email: editFormData.email || undefined,
          birthDate: editFormData.birthDate,
          obraSocial: editFormData.obraSocial || undefined,
          address: editFormData.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el paciente");
      }

      const updatedPatient = await response.json();

      // Actualizar la lista de pacientes
      setPatients((prev) =>
        prev.map((patient) =>
          patient._id === updatedPatient._id ? updatedPatient : patient,
        ),
      );
      setFilteredPatients((prev) =>
        prev.map((patient) =>
          patient._id === updatedPatient._id ? updatedPatient : patient,
        ),
      );

      // Cerrar modal y limpiar formulario
      setIsEditModalOpen(false);
      setEditingPatient(null);
      setEditFormData({
        name: "",
        lastName: "",
        dni: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        obraSocial: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al actualizar el paciente",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el paciente");
      }

      // Actualizar la lista de pacientes
      setPatients(patients.filter((patient) => patient._id !== patientId));
      setFilteredPatients(
        filteredPatients.filter((patient) => patient._id !== patientId),
      );
    } catch (error) {
      console.error("Error deleting patient:", error);
      setError("Error al eliminar el paciente");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Cargando pacientes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="patients-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Gestión de Pacientes
          </h1>
          <p className="text-primary/70 mt-1">
            Total: {filteredPatients.length} pacientes
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          <Link href="/admin/patients/new-patient">Nuevo Paciente</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="patients-header">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, teléfono o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="patients-table">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Lista de Pacientes
          </CardTitle>
          <CardDescription>
            Gestiona la información de todos los pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-primary/50">
                      No se encontraron pacientes
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient._id} className="hover:bg-primary/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-primary">
                          {patient.name} {patient.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-primary/50" />
                          {patient.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <IdCard className="w-3 h-3 mr-1 text-primary/50" />
                        {patient.dni}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/patients/${patient._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-primary/10 bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Dialog>
                          <form>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-primary/10 bg-transparent"
                                onClick={() => handleEditPatient(patient)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                          </form>
                        </Dialog>

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
                                ¿Estás seguro de borrar este paciente?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará
                                permanentemente el perfil de{" "}
                                <span className="text-primary text-md font-semibold">
                                  {patient.name} {patient.lastName}
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePatient(patient._id)}
                              >
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

      {/* Modal de Edición de Paciente */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary mb-4">
              Editar Paciente
            </h2>

            <form onSubmit={handleUpdatePatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI *
                  </label>
                  <input
                    type="text"
                    value={editFormData.dni}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        dni: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phoneNumber}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  value={editFormData.birthDate}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      birthDate: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Obra Social{" "}
                  <span className="text-gray-500 text-xs">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={editFormData.obraSocial}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      obraSocial: e.target.value,
                    }))
                  }
                  placeholder="Ej: OSDE, Swiss Medical, Particular"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editFormData.address.street}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  placeholder="Calle y número"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    setEditingPatient(null);
                    setEditFormData({
                      name: "",
                      lastName: "",
                      dni: "",
                      phoneNumber: "",
                      email: "",
                      birthDate: "",
                      obraSocial: "",
                      address: {
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                      },
                    });
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
                    "Actualizar Paciente"
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
