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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, parse, startOfWeek, getDay, startOfDay, addMinutes, isToday, isSameDay, addDays } from "date-fns";
import { es } from "date-fns/locale";

// Estilos personalizados para el calendario
const calendarStyles = `
  .rbc-calendar {
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .rbc-header {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    font-weight: 600;
    color: #374151;
    padding: 12px 8px;
  }
  
  .rbc-date-cell {
    padding: 8px;
    text-align: center;
    font-weight: 500;
  }
  
  .rbc-today {
    background-color: #dbeafe !important;
    color: #1d4ed8;
    font-weight: 700;
  }
  
  .rbc-off-range-bg {
    background-color: #f9fafb;
  }
  
  .rbc-event {
    border-radius: 6px;
    border: none;
    padding: 4px 6px;
    font-size: 11px;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .rbc-event-content {
    overflow: visible;
  }
  
  .rbc-time-view {
    border: 1px solid #e5e7eb;
  }
  
  .rbc-time-header {
    border-bottom: 2px solid #e5e7eb;
  }
  
  .rbc-time-content {
    border-top: 1px solid #e5e7eb;
  }
  
  .rbc-timeslot-group {
    border-bottom: 1px solid #f3f4f6;
  }
  
  .rbc-time-slot {
    border-bottom: 1px solid #f9fafb;
  }
  
  .rbc-time-slot:first-child {
    border-top: 1px solid #e5e7eb;
  }
  
  .rbc-current-time-indicator {
    background-color: #ef4444;
    height: 2px;
  }
  
  .rbc-toolbar {
    margin-bottom: 16px;
  }
  
  .rbc-btn-group > button {
    border-radius: 6px;
    margin: 0 2px;
    font-weight: 500;
  }
  
  .rbc-btn-group > button:hover {
    background-color: #f3f4f6;
  }
  
  .rbc-btn-group > button.rbc-active {
    background-color: #3b82f6;
    color: white;
  }
  
  .rbc-month-view {
    border: 1px solid #e5e7eb;
  }
  
  .rbc-month-row {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .rbc-date-cell > a {
    color: #374151;
    text-decoration: none;
  }
  
  .rbc-date-cell > a:hover {
    color: #1d4ed8;
  }
  
  .rbc-show-more {
    background-color: #f3f4f6;
    color: #6b7280;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 500;
  }
  
  .rbc-show-more:hover {
    background-color: #e5e7eb;
  }
`;
import { CalendarIcon, Plus, Clock, User, Loader2, Search, X, Grid3X3, Calendar as CalendarView, List, ChevronLeft, ChevronRight } from "lucide-react";


// Configuración para mostrar días en español
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay turnos programados',
  showMore: (total: number) => `+ ${total} más`,
  work_week: 'Semana laboral',
  yesterday: 'Ayer',
  tomorrow: 'Mañana',
  am: 'AM',
  pm: 'PM',
  amCapitalized: 'AM',
  pmCapitalized: 'PM',
};

interface Appointment {
  _id: string;
  client: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  treatment: {
    _id: string;
    name: string;
    description: string;
    cost: number;
    duration: number;
    category: string;
  };
  date: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
    resource: {
    appointment: Appointment;
    patient: string;
    treatment: string;
    status: string;
  };
}

export default function TurnosPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarEvent | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal de nuevo turno
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState({
    client: "",
    treatment: "",
    date: "",
    time: "",
    status: "Scheduled",
    notes: ""
  });
  const [creating, setCreating] = useState(false);
  
  // Estados para edición de turnos
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editAppointment, setEditAppointment] = useState({
    client: "",
    treatment: "",
    date: "",
    time: "",
    status: "Scheduled",
    notes: ""
  });
  const [updating, setUpdating] = useState(false);
  
  // Estados para la tabla de turnos
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // Cargar turnos desde la API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/turnos');
        if (!response.ok) {
          throw new Error('Error al cargar los turnos');
        }
        const data = await response.json();
        setAppointments(data);
        
        // Convertir turnos a eventos del calendario
        const events: CalendarEvent[] = data
          .filter((appointment: Appointment) => appointment.client && appointment.treatment) // Filtrar turnos con datos válidos
          .map((appointment: Appointment) => {
            const startDate = new Date(appointment.date);
            const endDate = addMinutes(startDate, appointment.treatment.duration);
            
            return {
              id: appointment._id,
              title: `${appointment.treatment.name} - ${appointment.client.name} ${appointment.client.lastName}`,
              start: startDate,
              end: endDate,
              resource: {
                appointment,
                patient: `${appointment.client.name} ${appointment.client.lastName}`,
                treatment: appointment.treatment.name,
                status: appointment.status,
              },
            };
          });
        
        setCalendarEvents(events);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Error al cargar los turnos');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cargar pacientes y tratamientos cuando se abre el modal
  useEffect(() => {
    if (isModalOpen) {
      const fetchData = async () => {
        try {
          const [patientsResponse, treatmentsResponse] = await Promise.all([
            fetch('/api/pacientes'),
            fetch('/api/tratamientos')
          ]);

          if (patientsResponse.ok && treatmentsResponse.ok) {
            const [patientsData, treatmentsData] = await Promise.all([
              patientsResponse.json(),
              treatmentsResponse.json()
            ]);
            
            setPatients(patientsData);
            setFilteredPatients(patientsData);
            setTreatments(treatmentsData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [isModalOpen]);

  // Filtrar pacientes por búsqueda
  useEffect(() => {
    if (patientSearch.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        `${patient.name} ${patient.lastName}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
        patient.dni.includes(patientSearch) ||
        patient.phoneNumber.includes(patientSearch)
      );
      setFilteredPatients(filtered);
    }
  }, [patientSearch, patients]);

  // Filtrar turnos según el modo de vista
  useEffect(() => {
    const filterAppointments = () => {
      let filtered: Appointment[] = [];
      const selectedDateObj = new Date(selectedDate);
      
      switch (viewMode) {
        case 'day':
          filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return isSameDay(appointmentDate, selectedDateObj);
          });
          break;
        case 'week':
          const weekStart = startOfWeek(selectedDateObj, { weekStartsOn: 1 });
          const endOfWeek = addDays(weekStart, 6);
          filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.getTime() >= weekStart.getTime() && appointmentDate.getTime() <= endOfWeek.getTime();
          });
          break;
        case 'month':
          filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.getMonth() === selectedDateObj.getMonth() && 
                   appointmentDate.getFullYear() === selectedDateObj.getFullYear();
          });
          break;
      }
      
      // Filtrar turnos con datos válidos y ordenar por fecha y hora
      const validFiltered = filtered.filter(appointment => appointment.client && appointment.treatment);
      validFiltered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setFilteredAppointments(validFiltered);
    };

    filterAppointments();
  }, [appointments, viewMode, selectedDate]);

  const handleAppointmentSelect = (event: CalendarEvent) => {
    setSelectedAppointment(event);
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setNewAppointment(prev => ({ ...prev, client: patient._id }));
    setPatientSearch(`${patient.name} ${patient.lastName}`);
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.client || !newAppointment.treatment || !newAppointment.date || !newAppointment.time) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      // Combinar fecha y hora
      const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      
      const response = await fetch('/api/turnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAppointment,
          date: appointmentDateTime.toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el turno');
      }

      const createdAppointment = await response.json();
      
      // Actualizar la lista de turnos
      setAppointments(prev => [createdAppointment, ...prev]);
      
      // Actualizar eventos del calendario
      const startDate = new Date(createdAppointment.date);
      const endDate = addMinutes(startDate, createdAppointment.treatment.duration);
      
      const newEvent: CalendarEvent = {
        id: createdAppointment._id,
        title: `${createdAppointment.treatment.name} - ${createdAppointment.client.name} ${createdAppointment.client.lastName}`,
        start: startDate,
        end: endDate,
        resource: {
          appointment: createdAppointment,
          patient: `${createdAppointment.client.name} ${createdAppointment.client.lastName}`,
          treatment: createdAppointment.treatment.name,
          status: createdAppointment.status,
        },
      };
      
      setCalendarEvents(prev => [...prev, newEvent]);
      
      // Limpiar formulario y cerrar modal
      setNewAppointment({
        client: "",
        treatment: "",
        date: "",
        time: "",
        status: "Scheduled",
        notes: ""
      });
      setSelectedPatient(null);
      setPatientSearch("");
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el turno');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setNewAppointment({
      client: "",
      treatment: "",
      date: "",
      time: "",
      status: "Scheduled",
      notes: ""
    });
    setSelectedPatient(null);
    setPatientSearch("");
    setError(null);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditAppointment({
      client: appointment.client._id,
      treatment: appointment.treatment._id,
      date: format(new Date(appointment.date), 'yyyy-MM-dd'),
      time: format(new Date(appointment.date), 'HH:mm'),
      status: appointment.status,
      notes: appointment.notes || ""
    });
    setSelectedPatient(appointment.client);
    setIsEditModalOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editAppointment.client || !editAppointment.treatment || !editAppointment.date || !editAppointment.time) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      // Combinar fecha y hora
      const appointmentDateTime = new Date(`${editAppointment.date}T${editAppointment.time}`);
      
      const response = await fetch(`/api/turnos/${editingAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editAppointment,
          date: appointmentDateTime.toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el turno');
      }

      const updatedAppointment = await response.json();
      
      // Actualizar la lista de turnos
      setAppointments(prev => prev.map(apt => 
        apt._id === updatedAppointment._id ? updatedAppointment : apt
      ));
      
      // Actualizar eventos del calendario
      const startDate = new Date(updatedAppointment.date);
      const endDate = addMinutes(startDate, updatedAppointment.treatment.duration);
      
      const updatedEvent: CalendarEvent = {
        id: updatedAppointment._id,
        title: `${updatedAppointment.treatment.name} - ${updatedAppointment.client.name} ${updatedAppointment.client.lastName}`,
        start: startDate,
        end: endDate,
        resource: {
          appointment: updatedAppointment,
          patient: `${updatedAppointment.client.name} ${updatedAppointment.client.lastName}`,
          treatment: updatedAppointment.treatment.name,
          status: updatedAppointment.status,
        },
      };
      
      setCalendarEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      
      // Cerrar modal y limpiar formulario
      setIsEditModalOpen(false);
      setEditingAppointment(null);
      setEditAppointment({
        client: "",
        treatment: "",
        date: "",
        time: "",
        status: "Scheduled",
        notes: ""
      });
      setSelectedPatient(null);
      
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el turno');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      return;
    }

    try {
      const response = await fetch(`/api/turnos/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar el turno');
      }

      // Actualizar la lista de turnos
      const updatedAppointments = await fetch('/api/turnos').then(res => res.json());
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error instanceof Error ? error.message : 'Error al cancelar el turno');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este turno? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/turnos/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el turno');
      }

      // Actualizar la lista de turnos
      const updatedAppointments = await fetch('/api/turnos').then(res => res.json());
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el turno');
    }
  };

  // Función para personalizar el estilo de los eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6'; // Azul por defecto
    
    switch (event.resource.status) {
      case 'Scheduled':
        backgroundColor = '#3b82f6'; // Azul
        break;
      case 'Completed':
        backgroundColor = '#10b981'; // Verde
        break;
      case 'Cancelled':
        backgroundColor = '#ef4444'; // Rojo
        break;
      case 'Pending':
        backgroundColor = '#f59e0b'; // Amarillo
        break;
      default:
        backgroundColor = '#6b7280'; // Gris
    }

    return {
      style: {
        backgroundColor,
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: '11px',
        fontWeight: '600',
        padding: '4px 6px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        opacity: 0.9,
      },
    };
  };

  // Función para formatear el título del evento
  const formatEventTitle = (event: CalendarEvent) => {
    const time = format(event.start, 'HH:mm', { locale: es });
    return `${time} - ${event.resource.treatment}`;
  };

  // Función para navegar por fechas
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(selectedDate);
    
    switch (direction) {
      case 'prev':
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setDate(newDate.getDate() - 1);
        }
        break;
      case 'next':
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setDate(newDate.getDate() + 1);
        }
        break;
      case 'today':
        newDate.setTime(new Date().getTime());
        break;
    }
    
    setSelectedDate(newDate);
  };

  // Función para obtener el título de la vista actual
  const getViewTitle = () => {
    const date = selectedDate;
    
    switch (viewMode) {
      case 'day':
        return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
      case 'week':
        const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
        const endOfWeekDate = addDays(startOfWeekDate, 6);
        return `${format(startOfWeekDate, 'dd MMM', { locale: es })} - ${format(endOfWeekDate, 'dd MMM yyyy', { locale: es })}`;
      case 'month':
        return format(date, "MMMM 'de' yyyy", { locale: es });
      default:
        return '';
    }
  };

  // Calcular estadísticas
  const today = startOfDay(new Date());
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = startOfDay(new Date(appointment.date));
    return appointmentDate.getTime() === today.getTime() && appointment.client && appointment.treatment;
  });

  const nextAppointment = todayAppointments
    .filter(appointment => new Date(appointment.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const uniquePatientsToday = new Set(
    todayAppointments
      .filter(appointment => appointment.client)
      .map(appointment => appointment.client._id)
  ).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Cargando turnos...</span>
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
    <>
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
    <div className="space-y-6">
      {/* Header */}
      <div className="turnos-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestión de Turnos</h1>
          <p className="text-primary/70 mt-1">Calendario de citas y horarios</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Turno
        </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Turno</DialogTitle>
              <DialogDescription>
                Selecciona un paciente, tratamiento y programa la fecha y hora del turno.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Selección de Paciente */}
              <div className="space-y-3">
                <Label htmlFor="patient-search">Paciente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="patient-search"
                    placeholder="Buscar por nombre, DNI o teléfono..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Lista de pacientes */}
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {filteredPatients.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500 text-center">
                      {patientSearch ? 'No se encontraron pacientes' : 'Cargando pacientes...'}
                    </p>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => handlePatientSelect(patient)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedPatient?._id === patient._id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{patient.name} {patient.lastName}</p>
                            <p className="text-sm text-gray-500">DNI: {patient.dni}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{patient.phoneNumber}</p>
                            {patient.email && (
                              <p className="text-xs text-gray-400">{patient.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selección de Tratamiento */}
              <div className="space-y-3">
                <Label htmlFor="treatment">Tratamiento</Label>
                <select
                  id="treatment"
                  value={newAppointment.treatment}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, treatment: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar tratamiento</option>
                  {treatments.map((treatment) => (
                    <option key={treatment._id} value={treatment._id}>
                      {treatment.name} - ${treatment.cost}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              
              
              {/* Notas */}
              <div className="space-y-3">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas adicionales sobre el turno..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateAppointment}
                  disabled={creating || !newAppointment.client || !newAppointment.treatment || !newAppointment.date || !newAppointment.time}
                  className="bg-primary hover:bg-primary/90"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Turno
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Edición de Turno */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Turno</DialogTitle>
              <DialogDescription>
                Modifica los datos del turno seleccionado.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              
              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="edit-date">Fecha</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editAppointment.date}
                    onChange={(e) => setEditAppointment(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-time">Hora</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editAppointment.time}
                    onChange={(e) => setEditAppointment(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-3">
                <Label htmlFor="edit-notes">Notas (opcional)</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Notas adicionales sobre el turno..."
                  value={editAppointment.notes}
                  onChange={(e) => setEditAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAppointment(null);
                    setEditAppointment({
                      client: "",
                      treatment: "",
                      date: "",
                      time: "",
                      status: "Scheduled",
                      notes: ""
                    });
                    setSelectedPatient(null);
                    setPatientSearch("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateAppointment}
                  disabled={updating || !editAppointment.client || !editAppointment.treatment || !editAppointment.date || !editAppointment.time}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Turno'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Appointments */}
      <div className="turnos-header grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Turnos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-white/80">
              {todayAppointments.filter(app => app.status === 'Scheduled').length} programados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Próximo Turno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextAppointment ? format(new Date(nextAppointment.date), 'HH:mm') : 'Sin turnos programados'}
            </div>
            <p className="text-xs text-white/80">
              {nextAppointment ? `${nextAppointment.client.name} - ${nextAppointment.treatment.name}` : 'Sin turnos programados'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-2" />
              Pacientes Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniquePatientsToday}</div>
            <p className="text-xs text-white/80">Diferentes pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Turnos */}
      <Card className="calendar-container">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
          <CardTitle className="text-primary flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
                Lista de Turnos
          </CardTitle>
          <CardDescription>
                {getViewTitle()}
          </CardDescription>
            </div>
            
            {/* Controles de filtro */}
            <div className="flex items-center gap-3">
              {/* Navegación */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate('today')}
                  className="h-8 px-3 text-sm font-medium"
                >
                  Hoy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Selector de vista */}
              <div className="flex items-center gap-1 bg-blue-50 rounded-lg p-1">
                <Button
                  variant={viewMode === 'day' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="h-8 px-3 text-xs"
                >
                  Día
                </Button>
                <Button
                  variant={viewMode === 'week' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="h-8 px-3 text-xs"
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === 'month' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="h-8 px-3 text-xs"
                >
                  Mes
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          
          
          

          {/* Tabla de turnos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay turnos programados</p>
                <p className="text-gray-400 text-sm">para el período seleccionado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tratamiento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments
                      .filter(appointment => appointment.client && appointment.treatment) // Filtrar turnos válidos
                      .map((appointment) => (
                      <tr 
                        key={appointment._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedAppointment({
                          id: appointment._id,
                          title: `${appointment.treatment.name} - ${appointment.client.name} ${appointment.client.lastName}`,
                          start: new Date(appointment.date),
                          end: addMinutes(new Date(appointment.date), appointment.treatment.duration),
                          resource: {
                            appointment,
                            patient: `${appointment.client.name} ${appointment.client.lastName}`,
                            treatment: appointment.treatment.name,
                            status: appointment.status,
                          },
                        })}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: es })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(appointment.date), 'HH:mm', { locale: es })}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client.name} {appointment.client.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.client.phoneNumber}
                          </div>
                          {appointment.client.email && (
                            <div className="text-sm text-gray-500">
                              {appointment.client.email}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.treatment.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.treatment.description}
                          </div>
                          
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${appointment.treatment.cost}
                        </td>
                        
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              Editar
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteAppointment(appointment._id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Appointment Details */}
     
    </div>
    </>
  );
}
