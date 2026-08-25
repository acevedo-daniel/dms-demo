import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/notas';

// GET - Obtener todas las notas
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find({})
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category')
      .sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Error al obtener las notas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva nota
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { client, treatment, description, attachments, createdBy } = body;

    // Validar campos requeridos
    if (!client || !treatment || !description || !createdBy) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newNote = new Note({
      client,
      treatment,
      description,
      attachments: attachments || [],
      createdBy
    });

    const savedNote = await newNote.save();
    
    // Populate para devolver datos completos
    const populatedNote = await Note.findById(savedNote._id)
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category');

    return NextResponse.json(populatedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Error al crear la nota' },
      { status: 500 }
    );
  }
}
