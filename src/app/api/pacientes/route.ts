import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Client from '@/models/pacientes';

// GET - Obtener todos los pacientes
export async function GET() {
  try {
    await connectDB();
    const patients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pacientes' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo paciente
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, lastName, dni, phoneNumber, birthDate, address, obraSocial } = body;

    // Validar campos requeridos
    if (!name || !lastName || !dni || !phoneNumber || !birthDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un paciente con el mismo DNI
    const existingPatient = await Client.findOne({ dni });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Ya existe un paciente con este DNI' },
        { status: 409 }
      );
    }

    const patientData: any = {
      name,
      lastName,
      dni,
      phoneNumber,
      birthDate: new Date(birthDate),
      address: address || {}
    };

    // Solo incluir email si se proporciona y no está vacío
    if (body.email && body.email.trim() !== '') {
      patientData.email = body.email;
    }

    // Solo incluir obra social si se proporciona y no está vacío
    if (obraSocial && obraSocial.trim() !== '') {
      patientData.obraSocial = obraSocial;
    }

    const newPatient = new Client(patientData);
    const savedPatient = await newPatient.save();
    return NextResponse.json(savedPatient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Error al crear el paciente' },
      { status: 500 }
    );
  }
}
