import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/turnos';

// GET - Obtener un turno por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const appointment = await Appointment.findById(id)
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category');
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Error al obtener el turno' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un turno por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const { client, treatment, date, status, notes } = body;

    // Verificar si el turno existe
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
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

    const updateData: any = {};
    if (client) updateData.client = client;
    if (treatment) updateData.treatment = treatment;
    if (date) updateData.date = new Date(date);
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name lastName email phoneNumber')
     .populate('treatment', 'name description cost duration category');

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el turno' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un turno por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
      );
    }

    await Appointment.findByIdAndDelete(id);
    return NextResponse.json(
      { message: 'Turno eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el turno' },
      { status: 500 }
    );
  }
}
