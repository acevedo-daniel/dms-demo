import type { Locale } from "@/lib/i18n/types";

type LocalizedValue = { en: string; es: string };

const appointmentNotes: Record<string, LocalizedValue> = {
  "40000000-0000-4000-8000-000000000003": {
    es: "Aviso telefónico con anticipación por viaje laboral; reprogramará la semana próxima.",
    en: "Patient called ahead due to a work trip; will reschedule next week.",
  },
  "40000000-0000-4000-8000-000000000006": {
    es: "Cancelación por cuadro gripal; se coordinará nuevo turno al recibir el alta médica.",
    en: "Cancelled due to flu symptoms; a new appointment will be arranged after medical clearance.",
  },
};

const patientNotes: Record<string, LocalizedValue> = {
  "50000000-0000-4000-8000-000000000001": {
    es: "Revisión previa a la profilaxis: encías sanas sin signos de sangrado activo. Se confirma indicación de limpieza semestral.",
    en: "Pre-prophylaxis review: healthy gums with no signs of active bleeding. Six-month cleaning plan confirmed.",
  },
  "50000000-0000-4000-8000-000000000002": {
    es: "Paciente con fobia dental moderada. Prefiere pausas breves durante la atención y turnos en las primeras horas de la mañana.",
    en: "Patient has moderate dental anxiety. Prefers brief pauses during care and appointments in the early morning.",
  },
  "50000000-0000-4000-8000-000000000003": {
    es: "Restauración oclusal en pieza 4.6 con resina compuesta estética. Oclusión calibrada con papel articular; evolución favorable.",
    en: "Occlusal restoration on tooth 4.6 with aesthetic composite resin. Occlusion calibrated with articulating paper; progress is favorable.",
  },
  "50000000-0000-4000-8000-000000000004": {
    es: "Solicitó recordatorio por mensaje 48 horas antes de la consulta para organizar su traslado desde zona norte.",
    en: "Requested a message reminder 48 hours before the appointment to arrange travel from the northern area.",
  },
  "50000000-0000-4000-8000-000000000005": {
    es: "Evaluación para blanqueamiento: no se observa hipersensibilidad dentinaria previa. Se tomaron registros fotográficos del tono inicial (A3).",
    en: "Whitening assessment: no previous dentin hypersensitivity observed. Baseline shade photographs were recorded (A3).",
  },
  "50000000-0000-4000-8000-000000000006": {
    es: "Disponibilidad horaria acotada: solo puede asistir antes de las 11:00 por compromisos laborales de rutina.",
    en: "Limited availability: can only attend before 11:00 due to regular work commitments.",
  },
  "50000000-0000-4000-8000-000000000007": {
    es: "Evaluación de rutina completada. Se detecta desgaste en cúspides molares por bruxismo nocturno. Se sugiere placa de relajación miorrelajante.",
    en: "Routine assessment completed. Wear was detected on molar cusps from nighttime bruxism. A muscle-relaxation night guard is recommended.",
  },
  "50000000-0000-4000-8000-000000000008": {
    es: "Acudió por molestia a estímulos térmicos fríos en sector superior izquierdo. Se realizó prueba de vitalidad pulpar con respuesta normal.",
    en: "Presented with sensitivity to cold stimuli in the upper-left area. A pulp vitality test showed a normal response.",
  },
  "50000000-0000-4000-8000-000000000009": {
    es: "Cambio de arcos termoactivados y reposición de bracket en pieza 2.4. Paciente refiere excelente adaptación al tratamiento.",
    en: "Thermoactive archwire changed and bracket replaced on tooth 2.4. Patient reports excellent adaptation to treatment.",
  },
  "50000000-0000-4000-8000-000000000010": {
    es: "Prefiere coordinar citas consecutivas en el mismo día cuando requiera más de una práctica odontológica.",
    en: "Prefers consecutive appointments on the same day when more than one dental procedure is needed.",
  },
  "50000000-0000-4000-8000-000000000011": {
    es: "Apertura cameral y conductometría en pieza 1.5. Instrumentación rotatoria completada sin dolor. Se colocó medicación intraconducto provisional.",
    en: "Access opening and working-length measurement on tooth 1.5. Rotary instrumentation completed without pain. Temporary intracanal medication placed.",
  },
  "50000000-0000-4000-8000-000000000012": {
    es: "Recordar verificación de presión arterial al ingreso y utilización de anestésico sin epinefrina según indicación médica.",
    en: "Remember to check blood pressure at arrival and use an epinephrine-free anaesthetic as medically indicated.",
  },
  "50000000-0000-4000-8000-000000000013": {
    es: "Limpieza y pulido general finalizados con éxito. Paciente colaborador; se fijó esquema de control preventivo cada seis meses.",
    en: "Cleaning and general polishing completed successfully. Cooperative patient; six-month preventive follow-up plan set.",
  },
  "50000000-0000-4000-8000-000000000014": {
    es: "Sondaje periodontal: profundidades de bolsa reducidas a valores fisiológicos. Buena respuesta al tratamiento de soporte.",
    en: "Periodontal probing: pocket depths reduced to physiological values. Good response to supportive treatment.",
  },
  "50000000-0000-4000-8000-000000000015": {
    es: "Finalizó tratamiento de reconstrucción estética en sector anterior. Paciente muy conforme con el resultado y anatomía lograda.",
    en: "Aesthetic reconstruction treatment completed in the anterior area. Patient is very satisfied with the result and achieved anatomy.",
  },
};

const clinicalAlerts: Record<string, LocalizedValue> = {
  "30000000-0000-4000-8000-000000000003": {
    es: "Alergia confirmada a la penicilina y betalactámicos. Requiere antibiótico alternativo (ej. claritromicina).",
    en: "Confirmed allergy to penicillin and beta-lactams. Requires an alternative antibiotic (e.g. clarithromycin).",
  },
  "30000000-0000-4000-8000-000000000013": {
    es: "Hipertensión arterial bajo tratamiento médico. Evitar anestésicos con vasoconstrictores de alta concentración.",
    en: "Hypertension under medical treatment. Avoid anaesthetics with high-concentration vasoconstrictors.",
  },
  "30000000-0000-4000-8000-000000000015": {
    es: "Bruxismo severo y tensión en ATM. Requiere pausas mandibulares durante sesiones prolongadas.",
    en: "Severe bruxism and TMJ tension. Requires jaw breaks during longer sessions.",
  },
};

function localize(
  values: Record<string, LocalizedValue>,
  id: string,
  fallback: string,
  locale: Locale,
) {
  return values[id]?.[locale] ?? fallback;
}

export function getLocalizedAppointmentNote(
  id: string,
  fallback: string,
  locale: Locale,
) {
  return localize(appointmentNotes, id, fallback, locale);
}

export function getLocalizedPatientNote(
  id: string,
  fallback: string,
  locale: Locale,
) {
  return localize(patientNotes, id, fallback, locale);
}

export function getLocalizedClinicalAlert(
  patientId: string,
  fallback: string,
  locale: Locale,
) {
  return localize(clinicalAlerts, patientId, fallback, locale);
}

export function getLocalizedTimingPreference(value: string, locale: Locale) {
  if (value === "Prefiere turno mañana") {
    return locale === "es" ? value : "Prefers morning appointments";
  }
  if (value === "Prefiere turno tarde") {
    return locale === "es" ? value : "Prefers afternoon appointments";
  }
  if (value === "Sin preferencia de horario registrada") {
    return locale === "es" ? value : "No timing preference recorded";
  }
  if (value === "Preferencia flexible" || value === "Horario flexible") {
    return locale === "es" ? value : "Flexible schedule";
  }
  return value;
}
