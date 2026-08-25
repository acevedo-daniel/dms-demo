import { NextRequest, NextResponse } from "next/server";

// GET - Obtener configuración de la clínica
export async function GET() {
  try {
    const config = {
      clinicName: "DMS Demo Clinic",
      address: {
        street: "Demo address",
        city: "Demo city",
        state: "Demo region",
        zipCode: "0000",
      },
      phone: "Not configured",
      email: "demo@example.com",
      workingHours: {
        monday: "9:00 - 18:00",
        tuesday: "9:00 - 18:00",
        wednesday: "9:00 - 18:00",
        thursday: "9:00 - 18:00",
        friday: "9:00 - 18:00",
        saturday: "9:00 - 13:00",
        sunday: "Cerrado",
      },
      services: [
        "Odontología General",
        "Ortodoncia",
        "Cirugía Oral",
        "Estética Dental",
        "Odontopediatría",
      ],
      settings: {
        appointmentDuration: 60, // minutos
        maxAppointmentsPerDay: 20,
        allowOnlineBooking: true,
        requireConfirmation: true,
      },
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar configuración de la clínica
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Por ahora solo devolvemos un mensaje de éxito
    // En el futuro esto actualizaría la configuración en la base de datos
    console.log("Configuration update request:", body);

    return NextResponse.json(
      { message: "Configuración actualizada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating configuration:", error);
    return NextResponse.json(
      { error: "Error al actualizar la configuración" },
      { status: 500 },
    );
  }
}
