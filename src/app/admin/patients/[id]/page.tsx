"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft,
  Plus,
  Stethoscope,
  Upload,
  FileText,
  Loader2,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Patient {
  _id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
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

interface Appointment {
  _id: string;
  date: string;
  status: string;
  client?: {
    _id: string;
    name: string;
    lastName: string;
  };
  treatment?: {
    _id: string;
    name: string;
    description: string;
    cost: number;
    duration: number;
    category: string;
  };
  notes?: string;
}

interface Note {
  _id: string;
  description: string;
  client?: {
    _id: string;
    name: string;
    lastName: string;
  };
  treatment?: {
    _id: string;
    name: string;
    category: string;
  };
  createdBy: string;
  createdAt: string;
  attachments: Array<{
    filename: string;
    path: string;
    uploadDate: string;
  }>;
}

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [newNote, setNewNote] = useState({
    treatment: "",
    description: "",
    createdBy: "Admin",
  });
  const [treatments, setTreatments] = useState<any[]>([]);

  // Estados para edición de notas
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteData, setEditNoteData] = useState({
    treatment: "",
    description: "",
    createdBy: "Admin",
  });
  const [updatingNote, setUpdatingNote] = useState(false);

  // Cargar datos del paciente
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);

        // Cargar datos en paralelo
        const [
          patientResponse,
          appointmentsResponse,
          notesResponse,
          treatmentsResponse,
        ] = await Promise.all([
          fetch(`/api/patients/${id}`),
          fetch("/api/appointments"),
          fetch("/api/notes"),
          fetch("/api/treatments"),
        ]);

        if (!patientResponse.ok) {
          throw new Error("Paciente no encontrado");
        }

        const [patientData, appointmentsData, notesData, treatmentsData] =
          await Promise.all([
            patientResponse.json(),
            appointmentsResponse.json(),
            notesResponse.json(),
            treatmentsResponse.json(),
          ]);

        setPatient(patientData);
        setTreatments(treatmentsData);

        // Filtrar citas y notas del paciente (solo con datos válidos)
        const patientAppointments = appointmentsData.filter(
          (appointment: any) =>
            appointment.client && appointment.client._id === id,
        );
        const patientNotes = notesData.filter(
          (note: any) => note.client && note.client._id === id,
        );

        setAppointments(patientAppointments);
        setNotes(patientNotes);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error al cargar los datos del paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getNextAppointment = () => {
    const today = new Date();
    const futureAppointments = appointments
      .filter(
        (appointment) =>
          appointment.client &&
          appointment.treatment &&
          new Date(appointment.date) > today,
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return futureAppointments[0] || null;
  };

  const addNote = async () => {
    if (!newNote.treatment || !newNote.description) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: id,
          treatment: newNote.treatment,
          description: newNote.description,
          createdBy: newNote.createdBy,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la nota");
      }

      const createdNote = await response.json();
      setNotes([createdNote, ...notes]);
      setNewNote({ treatment: "", description: "", createdBy: "Admin" });
      setError(null);
    } catch (error) {
      console.error("Error creating note:", error);
      setError("Error al crear la nota");
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditNoteData({
      treatment: note.treatment?._id || "",
      description: note.description,
      createdBy: note.createdBy,
    });
    setIsEditNoteModalOpen(true);
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editNoteData.treatment || !editNoteData.description) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setUpdatingNote(true);
      const response = await fetch(`/api/notes/${editingNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: id,
          treatment: editNoteData.treatment,
          description: editNoteData.description,
          createdBy: editNoteData.createdBy,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la nota");
      }

      const updatedNote = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note)),
      );

      // Cerrar modal y limpiar formulario
      setIsEditNoteModalOpen(false);
      setEditingNote(null);
      setEditNoteData({ treatment: "", description: "", createdBy: "Admin" });
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Error al actualizar la nota");
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la nota");
      }

      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Error al eliminar la nota");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">
          Cargando datos del paciente...
        </span>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Paciente no encontrado"}
          </p>
          <Link href="/admin/patients">
            <Button>Volver a Pacientes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextAppointment = getNextAppointment();

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col space-y-3">
            <Link href="/admin/patients">
              <Button variant="outline" size="sm" className="w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-words">
                Paciente: {patient.name} {patient.lastName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                DNI: {patient.dni} • {calculateAge(patient.birthDate)} años
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-2 sm:space-x-2">
            <Link href="/admin/appointments" className="flex-1 sm:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nuevo Turno</span>
                <span className="sm:hidden">Turno</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Datos Personales */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-primary text-base sm:text-lg">
            <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  Nombre
                </Label>
                <p className="text-base sm:text-lg break-words">
                  {patient.name}
                </p>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  Apellido
                </Label>
                <p className="text-base sm:text-lg break-words">
                  {patient.lastName}
                </p>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  DNI
                </Label>
                <p className="text-base sm:text-lg">{patient.dni}</p>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  Teléfono
                </Label>
                <p className="flex items-center text-base sm:text-lg">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span className="break-all">{patient.phoneNumber}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {patient.email && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-primary">
                    Email
                  </Label>
                  <p className="flex items-center text-base sm:text-lg">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="break-all">{patient.email}</span>
                  </p>
                </div>
              )}
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  Fecha de Nacimiento
                </Label>
                <p className="text-base sm:text-lg">
                  {format(parseISO(patient.birthDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium text-primary">
                  Edad
                </Label>
                <p className="text-base sm:text-lg">
                  {calculateAge(patient.birthDate)} años
                </p>
              </div>
              {patient.obraSocial && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-primary">
                    Obra Social
                  </Label>
                  <p className="text-base sm:text-lg break-words">
                    {patient.obraSocial}
                  </p>
                </div>
              )}
              {patient.address?.street && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-primary">
                    Dirección
                  </Label>
                  <p className="flex items-center text-base sm:text-lg">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500 flex-shrink-0" />
                    <span className="break-words">
                      {patient.address.street}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximo Turno */}
      {nextAppointment && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-primary text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Próximo Turno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex-1">
                <p className="font-medium text-base sm:text-lg break-words">
                  {nextAppointment.treatment?.name ||
                    "Tratamiento no disponible"}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {nextAppointment.treatment?.description || ""}
                </p>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 sm:border-l sm:pl-4">
                <p className="text-base sm:text-lg font-medium text-primary">
                  {format(parseISO(nextAppointment.date), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {format(parseISO(nextAppointment.date), "HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de Tratamientos y Notas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Notas Clínicas */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-primary text-base sm:text-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Notas Clínicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {/* Formulario para nueva nota */}
              <div className="p-3 sm:p-4 border rounded-lg bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="treatment" className="text-xs sm:text-sm">
                      Tratamiento
                    </Label>
                    <select
                      id="treatment"
                      value={newNote.treatment}
                      onChange={(e) =>
                        setNewNote({ ...newNote, treatment: e.target.value })
                      }
                      className="w-full p-2 text-sm sm:text-base border rounded-md"
                    >
                      <option value="">Seleccionar tratamiento</option>
                      {treatments.map((treatment) => (
                        <option key={treatment._id} value={treatment._id}>
                          {treatment.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-xs sm:text-sm">
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      value={newNote.description}
                      onChange={(e) =>
                        setNewNote({ ...newNote, description: e.target.value })
                      }
                      placeholder="Escribir nota clínica..."
                      rows={3}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <Button
                    onClick={addNote}
                    className="w-full text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>
              </div>

              {/* Lista de notas */}
              <div className="space-y-2 sm:space-y-3">
                {notes
                  .filter((note) => note.treatment) // Filtrar notas con tratamiento válido
                  .map((note) => (
                    <div
                      key={note._id}
                      className="p-2 sm:p-3 border rounded-lg bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base break-words">
                            {note.treatment?.name ||
                              "Tratamiento no disponible"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {format(parseISO(note.createdAt), "dd/MM/yyyy", {
                              locale: es,
                            })}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNote(note)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNote(note._id)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm break-words">
                        {note.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Citas */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-primary text-base sm:text-lg">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Historial de Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
                  No hay citas registradas
                </p>
              ) : (
                appointments
                  .filter((appointment) => appointment.treatment) // Filtrar citas con tratamiento válido
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-2 sm:p-3 border rounded-lg bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base break-words">
                            {appointment.treatment?.name ||
                              "Tratamiento no disponible"}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {format(parseISO(appointment.date), "dd/MM/yyyy", {
                              locale: es,
                            })}
                          </p>
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-xs sm:text-sm break-words">{error}</p>
        </div>
      )}

      {/* Modal para editar nota */}
      {isEditNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Editar Nota
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="edit-treatment" className="text-xs sm:text-sm">
                  Tratamiento
                </Label>
                <select
                  id="edit-treatment"
                  value={editNoteData.treatment}
                  onChange={(e) =>
                    setEditNoteData({
                      ...editNoteData,
                      treatment: e.target.value,
                    })
                  }
                  className="w-full p-2 text-sm sm:text-base border rounded-md"
                >
                  <option value="">Seleccionar tratamiento</option>
                  {treatments.map((treatment) => (
                    <option key={treatment._id} value={treatment._id}>
                      {treatment.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label
                  htmlFor="edit-description"
                  className="text-xs sm:text-sm"
                >
                  Descripción
                </Label>
                <Textarea
                  id="edit-description"
                  value={editNoteData.description}
                  onChange={(e) =>
                    setEditNoteData({
                      ...editNoteData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Escribir nota clínica..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditNoteModalOpen(false);
                    setEditingNote(null);
                    setEditNoteData({
                      treatment: "",
                      description: "",
                      createdBy: "Admin",
                    });
                  }}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateNote}
                  disabled={updatingNote}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {updatingNote ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Actualizar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
