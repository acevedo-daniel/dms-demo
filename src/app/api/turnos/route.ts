import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/turnos';

// GET - Obtener todos los turnos
export async function GET() {
  try {
    console.log('[API Turnos] Iniciando conexión a DB...');
    await connectDB();
    console.log('[API Turnos] Conectado a DB, obteniendo turnos...');
    
    const appointments = await Appointment.find({})
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category')
      .sort({ date: -1 });
    
    console.log(`[API Turnos] ${appointments.length} turnos encontrados`);
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[API Turnos] Error completo:', error);
    console.error('[API Turnos] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Error al obtener los turnos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo turno
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { client, treatment, date, status, notes } = body;

    // Validar campos requeridos
    if (!client || !treatment || !date) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar status si se proporciona
    if (status) {
      const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'Pending'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Estado no válido' },
          { status: 400 }
        );
      }
    }

    const newAppointment = new Appointment({
      client,
      treatment,
      date: new Date(date),
      status: status || 'Scheduled',
      notes: notes || ''
    });

    const savedAppointment = await newAppointment.save();
    
    // Populate para devolver datos completos
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category');

    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Error al crear el turno' },
      { status: 500 }
    );
  }
}
