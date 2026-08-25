import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/notas';

// GET - Obtener una nota por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const note = await Note.findById(id)
      .populate('client', 'name lastName email phoneNumber')
      .populate('treatment', 'name description cost duration category');
    
    if (!note) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Error al obtener la nota' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una nota por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const { client, treatment, description, attachments, createdBy } = body;

    // Verificar si la nota existe
    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (client) updateData.client = client;
    if (treatment) updateData.treatment = treatment;
    if (description) updateData.description = description;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (createdBy) updateData.createdBy = createdBy;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name lastName email phoneNumber')
     .populate('treatment', 'name description cost duration category');

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la nota' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una nota por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json(
        { error: 'Nota no encontrada' },
        { status: 404 }
      );
    }

    await Note.findByIdAndDelete(id);
    return NextResponse.json(
      { message: 'Nota eliminada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la nota' },
      { status: 500 }
    );
  }
}
