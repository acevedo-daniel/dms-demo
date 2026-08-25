import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Treatment from '@/models/tratamientos';

// GET - Obtener un tratamiento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const treatment = await Treatment.findById(id);
    
    if (!treatment) {
      return NextResponse.json(
        { error: 'Tratamiento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment);
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Error al obtener el tratamiento' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un tratamiento por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const { name, description, cost, duration, category } = body;

    // Verificar si el tratamiento existe
    const existingTreatment = await Treatment.findById(id);
    if (!existingTreatment) {
      return NextResponse.json(
        { error: 'Tratamiento no encontrado' },
        { status: 404 }
      );
    }

    // Validar categoría si se proporciona
    if (category) {
      const validCategories = ['General', 'Orthodontics', 'Surgery', 'Aesthetic', 'Pediatric'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Categoría no válida' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (category) updateData.category = category;

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedTreatment);
  } catch (error) {
    console.error('Error updating treatment:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el tratamiento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un tratamiento por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const treatment = await Treatment.findById(id);
    if (!treatment) {
      return NextResponse.json(
        { error: 'Tratamiento no encontrado' },
        { status: 404 }
      );
    }

    await Treatment.findByIdAndDelete(id);
    return NextResponse.json(
      { message: 'Tratamiento eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el tratamiento' },
      { status: 500 }
    );
  }
}
