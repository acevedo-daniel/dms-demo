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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Calendar,
  Loader2,
} from "lucide-react";

interface Note {
  _id: string;
  client: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  } | null;
  treatment: {
    _id: string;
    name: string;
    description: string;
    cost: number;
    duration: number;
    category: string;
  } | null;
  description: string;
  attachments: Array<{
    filename: string;
    path: string;
    uploadDate: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotasPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState({
    client: "",
    treatment: "",
    description: "",
    createdBy: "Admin",
  });
  const [clients, setClients] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);

  // Cargar datos desde las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar notas, clientes y tratamientos en paralelo
        const [notesResponse, clientsResponse, treatmentsResponse] =
          await Promise.all([
            fetch("/api/notes"),
            fetch("/api/patients"),
            fetch("/api/treatments"),
          ]);

        if (
          !notesResponse.ok ||
          !clientsResponse.ok ||
          !treatmentsResponse.ok
        ) {
          throw new Error("Error al cargar los datos");
        }

        const [notesData, clientsData, treatmentsData] = await Promise.all([
          notesResponse.json(),
          clientsResponse.json(),
          treatmentsResponse.json(),
        ]);

        setNotes(notesData);
        setFilteredNotes(notesData);
        setClients(clientsData);
        setTreatments(treatmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        // Only filter notes that have valid client and treatment data
        note.client &&
        note.treatment &&
        (note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.client.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note.treatment.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note.createdBy.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setFilteredNotes(filtered);
  }, [searchTerm, notes]);

  const addNote = async () => {
    if (!newNote.client || !newNote.treatment || !newNote.description) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la nota");
      }

      const createdNote = await response.json();
      setNotes([createdNote, ...notes]);
      setFilteredNotes([createdNote, ...filteredNotes]);
      setNewNote({
        client: "",
        treatment: "",
        description: "",
        createdBy: "Admin",
      });
      setError(null);
    } catch (error) {
      console.error("Error creating note:", error);
      setError(
        error instanceof Error ? error.message : "Error al crear la nota",
      );
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la nota");
      }

      setNotes(notes.filter((note) => note._id !== noteId));
      setFilteredNotes(filteredNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Error al eliminar la nota");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      General: "bg-blue-100 text-blue-800",
      Orthodontics: "bg-green-100 text-green-800",
      Surgery: "bg-purple-100 text-purple-800",
      Aesthetic: "bg-orange-100 text-orange-800",
      Pediatric: "bg-pink-100 text-pink-800",
    };
    return colors[category] || colors["General"];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Cargando notas...</span>
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
      <div className="notes-header">
        <h1 className="text-3xl font-bold text-primary">Notas Clínicas</h1>
        <p className="text-primary/70 mt-1">
          Total: {filteredNotes.length} notas
        </p>
      </div>

      {/* Search */}
      <Card className="notes-header">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-4 h-4" />
            <Input
              placeholder="Buscar notas por título, contenido o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Note Form */}
        <Card className="notes-form">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Nueva Nota Clínica
            </CardTitle>
            <CardDescription>Agregar nota clínica al sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="note-client">Paciente</Label>
              <select
                id="note-client"
                value={newNote.client}
                onChange={(e) =>
                  setNewNote({ ...newNote, client: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Seleccionar paciente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="note-treatment">Tratamiento</Label>
              <select
                id="note-treatment"
                value={newNote.treatment}
                onChange={(e) =>
                  setNewNote({ ...newNote, treatment: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Seleccionar tratamiento</option>
                {treatments.map((treatment) => (
                  <option key={treatment._id} value={treatment._id}>
                    {treatment.name} - {treatment.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="note-description">Descripción de la Nota</Label>
              <Textarea
                id="note-description"
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
                placeholder="Escribir nota clínica..."
                rows={6}
                required
              />
            </div>

            <Button
              onClick={addNote}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={
                !newNote.client || !newNote.treatment || !newNote.description
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Nota Clínica
            </Button>
          </CardContent>
        </Card>

        {/* Notes List */}
        <Card className="notes-list">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Notas Clínicas Recientes
            </CardTitle>
            <CardDescription>
              Últimas notas clínicas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredNotes
                .filter((note) => note.client && note.treatment) // Filter out notes with null references
                .map((note) => (
                  <div
                    key={note._id}
                    className="border border-primary/20 rounded-lg p-4 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-primary">
                          {note.client?.name || "N/A"}{" "}
                          {note.client?.lastName || ""}
                        </h4>
                        <p className="text-sm text-primary/60">
                          {note.treatment?.name || "Tratamiento no disponible"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getCategoryColor(
                            note.treatment?.category || "General",
                          )}
                        >
                          {note.treatment?.category || "General"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note._id)}
                          className="text-red-600 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-primary/70 mb-3 line-clamp-3">
                      {note.description}
                    </p>

                    <div className="flex justify-between items-center text-xs text-primary/50">
                      <span>Por: {note.createdBy}</span>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(note.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </div>

                    {note.attachments && note.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-primary/50">
                          {note.attachments.length} archivo(s) adjunto(s)
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-primary/50">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron notas clínicas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
