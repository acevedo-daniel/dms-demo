import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Treatment from '@/models/tratamientos';

// GET - Obtener todos los tratamientos
export async function GET() {
  try {
    await connectDB();
    const treatments = await Treatment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(treatments);
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los tratamientos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo tratamiento
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, description, cost, duration, category } = body;

    // Validar campos requeridos
    if (!name || !description || !cost || !duration || !category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar categoría
    const validCategories = ['General', 'Orthodontics', 'Surgery', 'Aesthetic', 'Pediatric'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría no válida' },
        { status: 400 }
      );
    }

    const newTreatment = new Treatment({
      name,
      description,
      cost: parseFloat(cost),
      duration: parseInt(duration),
      category
    });

    const savedTreatment = await newTreatment.save();
    return NextResponse.json(savedTreatment, { status: 201 });
  } catch (error) {
    console.error('Error creating treatment:', error);
    return NextResponse.json(
      { error: 'Error al crear el tratamiento' },
      { status: 500 }
    );
  }
}
