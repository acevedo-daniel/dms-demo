import { hashPassword } from "better-auth/crypto";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import {
  DEMO_ADMIN_NAME,
  DEMO_ADMIN_ROLE,
  DEMO_PRACTICE_ID,
  getDemoClock,
} from "@/lib/demo/constants";

type DemoDatabase = NodePgDatabase<typeof schema>;

const practiceId = DEMO_PRACTICE_ID;
const demoAdminId = "demo-admin";

type AppointmentStatus =
  "SCHEDULED" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "CANCELLED";

function appointment(
  idSuffix: string,
  patientSuffix: string,
  treatmentSuffix: string,
  startsAt: string,
  durationMinutes: number,
  status: AppointmentStatus,
  note?: string,
  operatory = Number(idSuffix) % 2 === 0 ? 2 : 1,
) {
  const timestamp = getDemoClock();

  return {
    id: `40000000-0000-4000-8000-000000000${idSuffix}`,
    practiceId,
    patientId: `30000000-0000-4000-8000-000000000${patientSuffix}`,
    treatmentId: `20000000-0000-4000-8000-000000000${treatmentSuffix}`,
    startsAt: new Date(startsAt),
    durationMinutes,
    status,
    operatory,
    ...(note ? { note } : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function patientNote(
  idSuffix: string,
  patientSuffix: string,
  body: string,
  createdAt: string,
  treatmentSuffix?: string,
) {
  const timestamp = new Date(createdAt);

  return {
    id: `50000000-0000-4000-8000-000000000${idSuffix}`,
    practiceId,
    patientId: `30000000-0000-4000-8000-000000000${patientSuffix}`,
    ...(treatmentSuffix
      ? {
          treatmentId: `20000000-0000-4000-8000-000000000${treatmentSuffix}`,
        }
      : {}),
    body,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function seedDemoWorkspace(db: DemoDatabase) {
  const demoClock = getDemoClock();

  await db.transaction(async (tx) => {
    await tx
      .insert(schema.practices)
      .values({
        id: practiceId,
        name: "Atelier Dental",
        timezone: "America/Argentina/Buenos_Aires",
        createdAt: demoClock,
        updatedAt: demoClock,
      })
      .onConflictDoUpdate({
        target: schema.practices.id,
        set: {
          name: "Atelier Dental",
          timezone: "America/Argentina/Buenos_Aires",
          updatedAt: demoClock,
        },
      });

    await tx
      .delete(schema.patientNotes)
      .where(eq(schema.patientNotes.practiceId, practiceId));
    await tx
      .delete(schema.appointments)
      .where(eq(schema.appointments.practiceId, practiceId));
    await tx
      .delete(schema.patients)
      .where(eq(schema.patients.practiceId, practiceId));
    await tx
      .delete(schema.treatments)
      .where(eq(schema.treatments.practiceId, practiceId));

    await tx.insert(schema.treatments).values([
      {
        id: "20000000-0000-4000-8000-000000000001",
        practiceId,
        name: "Consulta de rutina",
        category: "Odontología general",
        description:
          "Evaluación clínica integral, control odontológico preventivo y plan de cuidado personalizado.",
        defaultDurationMinutes: 30,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        practiceId,
        name: "Higiene dental",
        category: "Prevención",
        description:
          "Profilaxis profunda, remoción de placa y pulido coronal con técnicas no invasivas.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000003",
        practiceId,
        name: "Tratamiento restaurador",
        category: "Odontología restauradora",
        description:
          "Restauración estética directa con resinas compuestas y preservación de tejido dentario.",
        defaultDurationMinutes: 60,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000004",
        practiceId,
        name: "Consulta de urgencia",
        category: "Odontología general",
        description:
          "Atención inmediata y diagnóstico prioritario ante dolor agudo, trauma o urgencias funcionales.",
        defaultDurationMinutes: 30,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000005",
        practiceId,
        name: "Consulta de blanqueamiento",
        category: "Estética dental",
        description:
          "Evaluación de esmalte y definición de protocolo personalizado para blanqueamiento ambulatorio o en sillón.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000006",
        practiceId,
        name: "Control de ortodoncia",
        category: "Ortodoncia",
        description:
          "Ajuste periódico de aparatología fija o alineadores y seguimiento biomecánico del avance.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000007",
        practiceId,
        name: "Endodoncia mecanizada",
        category: "Endodoncia",
        description:
          "Tratamiento de conducto radicular con instrumentación rotatoria y obturación tridimensional.",
        defaultDurationMinutes: 60,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "20000000-0000-4000-8000-000000000008",
        practiceId,
        name: "Mantenimiento periodontal",
        category: "Periodoncia",
        description:
          "Raspaje subgingival por cuadrante, monitoreo de bolsas periodontales y control de soporte óseo.",
        defaultDurationMinutes: 45,
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx.insert(schema.patients).values([
      {
        id: "30000000-0000-4000-8000-000000000001",
        practiceId,
        identifier: "AT-1001",
        firstName: "Alex",
        lastName: "Quinn",
        email: "patient-1001@example.com",
        phone: "+54 11 0000-1001",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000002",
        practiceId,
        identifier: "AT-1002",
        firstName: "Casey",
        lastName: "Morgan",
        email: "patient-1002@example.com",
        phone: "+54 11 0000-1002",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000003",
        practiceId,
        identifier: "AT-1003",
        firstName: "Jordan",
        lastName: "Ellis",
        email: "patient-1003@example.com",
        phone: "+54 11 0000-1003",
        clinicalAlert:
          "Alergia confirmada a la penicilina y betalactámicos. Requiere antibiótico alternativo (ej. claritromicina).",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000004",
        practiceId,
        identifier: "AT-1004",
        firstName: "Taylor",
        lastName: "Reed",
        email: "patient-1004@example.com",
        phone: "+54 11 0000-1004",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000005",
        practiceId,
        identifier: "AT-1005",
        firstName: "Morgan",
        lastName: "Vale",
        email: "patient-1005@example.com",
        phone: "+54 11 0000-1005",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000006",
        practiceId,
        identifier: "AT-1006",
        firstName: "Riley",
        lastName: "Park",
        email: "patient-1006@example.com",
        phone: "+54 11 0000-1006",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000007",
        practiceId,
        identifier: "AT-1007",
        firstName: "Cameron",
        lastName: "Stone",
        email: "patient-1007@example.com",
        phone: "+54 11 0000-1007",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000008",
        practiceId,
        identifier: "AT-1008",
        firstName: "Avery",
        lastName: "Blake",
        email: "patient-1008@example.com",
        phone: "+54 11 0000-1008",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000009",
        practiceId,
        identifier: "AT-1009",
        firstName: "Quinn",
        lastName: "Harper",
        email: "patient-1009@example.com",
        phone: "+54 11 0000-1009",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000010",
        practiceId,
        identifier: "AT-1010",
        firstName: "Rowan",
        lastName: "Flynn",
        email: "patient-1010@example.com",
        phone: "+54 11 0000-1010",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000011",
        practiceId,
        identifier: "AT-1011",
        firstName: "Jules",
        lastName: "Marin",
        email: "patient-1011@example.com",
        phone: "+54 11 0000-1011",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000012",
        practiceId,
        identifier: "AT-1012",
        firstName: "Devon",
        lastName: "Lane",
        email: "patient-1012@example.com",
        phone: "+54 11 0000-1012",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000013",
        practiceId,
        identifier: "AT-1013",
        firstName: "Sofía",
        lastName: "Méndez",
        email: "patient-1013@example.com",
        phone: "+54 11 0000-1013",
        clinicalAlert:
          "Hipertensión arterial bajo tratamiento médico. Evitar anestésicos con vasoconstrictores de alta concentración.",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000014",
        practiceId,
        identifier: "AT-1014",
        firstName: "Mateo",
        lastName: "Rossi",
        email: "patient-1014@example.com",
        phone: "+54 11 0000-1014",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000015",
        practiceId,
        identifier: "AT-1015",
        firstName: "Valentina",
        lastName: "Paz",
        email: "patient-1015@example.com",
        phone: "+54 11 0000-1015",
        clinicalAlert:
          "Bruxismo severo y tensión en ATM. Requiere pausas mandibulares durante sesiones prolongadas.",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
      {
        id: "30000000-0000-4000-8000-000000000016",
        practiceId,
        identifier: "AT-1016",
        firstName: "Lucas",
        lastName: "Benítez",
        email: "patient-1016@example.com",
        phone: "+54 11 0000-1016",
        createdAt: demoClock,
        updatedAt: demoClock,
      },
    ]);

    await tx
      .insert(schema.appointments)
      .values([
        appointment(
          "001",
          "001",
          "001",
          "2026-05-07T12:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "002",
          "005",
          "002",
          "2026-05-07T13:00:00.000Z",
          45,
          "COMPLETED",
        ),
        appointment(
          "003",
          "002",
          "003",
          "2026-05-08T14:00:00.000Z",
          60,
          "CANCELLED",
          "Aviso telefónico con anticipación por viaje laboral; reprogramará la semana próxima.",
        ),
        appointment(
          "004",
          "008",
          "004",
          "2026-05-11T12:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "005",
          "006",
          "001",
          "2026-05-11T13:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "006",
          "007",
          "006",
          "2026-05-11T15:00:00.000Z",
          45,
          "CANCELLED",
          "Cancelación por cuadro gripal; se coordinará nuevo turno al recibir el alta médica.",
        ),
        appointment(
          "007",
          "001",
          "002",
          "2026-05-12T12:30:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "008",
          "003",
          "001",
          "2026-05-12T13:30:00.000Z",
          30,
          "ARRIVED",
        ),
        appointment(
          "009",
          "005",
          "003",
          "2026-05-12T14:30:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "010",
          "007",
          "005",
          "2026-05-12T16:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "011",
          "009",
          "001",
          "2026-05-12T17:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "012",
          "010",
          "004",
          "2026-05-12T18:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "013",
          "011",
          "006",
          "2026-05-12T19:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "014",
          "004",
          "003",
          "2026-05-13T12:00:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "015",
          "002",
          "002",
          "2026-05-13T13:30:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "016",
          "006",
          "001",
          "2026-05-13T15:00:00.000Z",
          30,
          "CONFIRMED",
        ),
        appointment(
          "017",
          "008",
          "005",
          "2026-05-13T17:00:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "018",
          "012",
          "004",
          "2026-05-13T18:00:00.000Z",
          30,
          "CONFIRMED",
        ),
        appointment(
          "019",
          "010",
          "006",
          "2026-05-14T12:00:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "020",
          "003",
          "002",
          "2026-05-14T14:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "021",
          "007",
          "003",
          "2026-05-14T16:00:00.000Z",
          60,
          "SCHEDULED",
        ),
        appointment(
          "022",
          "009",
          "001",
          "2026-05-15T13:00:00.000Z",
          30,
          "SCHEDULED",
        ),
        appointment(
          "023",
          "001",
          "005",
          "2026-05-15T15:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "024",
          "005",
          "006",
          "2026-05-15T17:00:00.000Z",
          45,
          "SCHEDULED",
        ),
        appointment(
          "025",
          "013",
          "001",
          "2026-05-06T13:00:00.000Z",
          30,
          "COMPLETED",
        ),
        appointment(
          "026",
          "014",
          "002",
          "2026-05-08T15:00:00.000Z",
          45,
          "COMPLETED",
        ),
        appointment(
          "027",
          "016",
          "003",
          "2026-05-07T16:00:00.000Z",
          60,
          "COMPLETED",
        ),
        appointment(
          "028",
          "015",
          "008",
          "2026-05-14T15:00:00.000Z",
          45,
          "CONFIRMED",
        ),
        appointment(
          "029",
          "013",
          "007",
          "2026-05-08T12:00:00.000Z",
          60,
          "COMPLETED",
        ),
      ]);

    await tx
      .insert(schema.patientNotes)
      .values([
        patientNote(
          "001",
          "001",
          "Revisión previa a la profilaxis: encías sanas sin signos de sangrado activo. Se confirma indicación de limpieza semestral.",
          "2026-05-11T15:00:00.000Z",
          "002",
        ),
        patientNote(
          "002",
          "003",
          "Paciente con fobia dental moderada. Prefiere pausas breves durante la atención y turnos en las primeras horas de la mañana.",
          "2026-05-12T11:00:00.000Z",
        ),
        patientNote(
          "003",
          "005",
          "Restauración oclusal en pieza 4.6 con resina compuesta estética. Oclusión calibrada con papel articular; evolución favorable.",
          "2026-05-07T14:00:00.000Z",
          "003",
        ),
        patientNote(
          "004",
          "006",
          "Solicitó recordatorio por mensaje 48 horas antes de la consulta para organizar su traslado desde zona norte.",
          "2026-05-06T15:00:00.000Z",
        ),
        patientNote(
          "005",
          "007",
          "Evaluación para blanqueamiento: no se observa hipersensibilidad dentinaria previa. Se tomaron registros fotográficos del tono inicial (A3).",
          "2026-05-12T13:00:00.000Z",
          "005",
        ),
        patientNote(
          "006",
          "008",
          "Disponibilidad horaria acotada: solo puede asistir antes de las 11:00 por compromisos laborales de rutina.",
          "2026-05-10T15:00:00.000Z",
        ),
        patientNote(
          "007",
          "009",
          "Evaluación de rutina completada. Se detecta desgaste en cúspides molares por bruxismo nocturno. Se sugiere placa de relajación miorrelajante.",
          "2026-05-12T14:00:00.000Z",
          "001",
        ),
        patientNote(
          "008",
          "010",
          "Acudió por molestia a estímulos térmicos fríos en sector superior izquierdo. Se realizó prueba de vitalidad pulpar con respuesta normal.",
          "2026-05-12T15:00:00.000Z",
          "004",
        ),
        patientNote(
          "009",
          "011",
          "Cambio de arcos termoactivados y reposición de bracket en pieza 2.4. Paciente refiere excelente adaptación al tratamiento.",
          "2026-05-08T14:00:00.000Z",
          "006",
        ),
        patientNote(
          "010",
          "012",
          "Prefiere coordinar citas consecutivas en el mismo día cuando requiera más de una práctica odontológica.",
          "2026-05-11T14:00:00.000Z",
        ),
        patientNote(
          "011",
          "013",
          "Apertura cameral y conductometría en pieza 1.5. Instrumentación rotatoria completada sin dolor. Se colocó medicación intraconducto provisional.",
          "2026-05-08T14:00:00.000Z",
          "007",
        ),
        patientNote(
          "012",
          "013",
          "Recordar verificación de presión arterial al ingreso y utilización de anestésico sin epinefrina según indicación médica.",
          "2026-05-06T15:00:00.000Z",
        ),
        patientNote(
          "013",
          "014",
          "Limpieza y pulido general finalizados con éxito. Paciente colaborador; se fijó esquema de control preventivo cada seis meses.",
          "2026-05-08T16:00:00.000Z",
          "002",
        ),
        patientNote(
          "014",
          "015",
          "Sondaje periodontal: profundidades de bolsa reducidas a valores fisiológicos. Buena respuesta al tratamiento de soporte.",
          "2026-05-11T10:00:00.000Z",
          "008",
        ),
        patientNote(
          "015",
          "016",
          "Finalizó tratamiento de reconstrucción estética en sector anterior. Paciente muy conforme con el resultado y anatomía lograda.",
          "2026-05-07T17:30:00.000Z",
          "003",
        ),
      ]);
  });
}

export async function seedDemoIdentity(
  db: DemoDatabase,
  credentials: { email: string; password: string },
) {
  const demoClock = getDemoClock();

  await db.transaction(async (tx) => {
    await tx.delete(schema.authVerifications);
    await tx.delete(schema.authSessions);
    await tx.delete(schema.authAccounts);
    await tx.delete(schema.authUsers);
  });

  const password = await hashPassword(credentials.password);

  await db.insert(schema.authUsers).values({
    id: demoAdminId,
    practiceId,
    role: DEMO_ADMIN_ROLE,
    name: DEMO_ADMIN_NAME,
    email: credentials.email,
    emailVerified: true,
    createdAt: demoClock,
    updatedAt: demoClock,
  });

  await db.insert(schema.authAccounts).values({
    id: "demo-admin-credential",
    issuer: "local:credential",
    accountId: demoAdminId,
    providerId: "credential",
    userId: demoAdminId,
    password,
    createdAt: demoClock,
    updatedAt: demoClock,
  });
}
