import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/pacientes';

// GET - Obtener un paciente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const patient = await Client.findById(id);
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Error al obtener el paciente' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un paciente por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const { name, lastName, dni, phoneNumber, email, birthDate, address, obraSocial } = body;

    // Verificar si el paciente existe
    const existingPatient = await Client.findById(id);
    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el DNI o email ya existen en otro paciente
    if (dni || email) {
      const duplicatePatient = await Client.findOne({
        _id: { $ne: id },
        $or: [
          ...(dni ? [{ dni }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (duplicatePatient) {
        return NextResponse.json(
          { error: 'Ya existe otro paciente con este DNI o email' },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;
    if (dni) updateData.dni = dni;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (birthDate) updateData.birthDate = new Date(birthDate);
    if (address) updateData.address = address;
    if (obraSocial !== undefined) updateData.obraSocial = obraSocial;

    const updatedPatient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el paciente' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un paciente por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const patient = await Client.findById(id);
    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    await Client.findByIdAndDelete(id);
    return NextResponse.json(
      { message: 'Paciente eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el paciente' },
      { status: 500 }
    );
  }
}
