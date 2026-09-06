import type { Locale } from "./types";

export interface LocalizedTreatmentInfo {
  name: string;
  category: string;
  description: string;
}

export const treatmentDictionary: Record<
  string,
  Record<Locale, LocalizedTreatmentInfo>
> = {
  "20000000-0000-4000-8000-000000000001": {
    es: {
      name: "Consulta de rutina",
      category: "Odontología general",
      description:
        "Evaluación clínica integral, control odontológico preventivo y plan de cuidado personalizado.",
    },
    en: {
      name: "Routine Checkup",
      category: "General Dentistry",
      description:
        "Comprehensive clinical evaluation, preventive checkup, and personalized care plan.",
    },
  },
  "20000000-0000-4000-8000-000000000002": {
    es: {
      name: "Higiene dental",
      category: "Prevención",
      description:
        "Profilaxis profunda, remoción de placa y pulido coronal con técnicas no invasivas.",
    },
    en: {
      name: "Dental Hygiene",
      category: "Preventive Care",
      description:
        "Deep prophylaxis, plaque removal, and coronal polishing using non-invasive techniques.",
    },
  },
  "20000000-0000-4000-8000-000000000003": {
    es: {
      name: "Tratamiento restaurador",
      category: "Odontología restauradora",
      description:
        "Restauración estética directa con resinas compuestas y preservación de tejido dentario.",
    },
    en: {
      name: "Restorative Treatment",
      category: "Restorative Care",
      description:
        "Direct composite resin restoration and tooth structure preservation.",
    },
  },
  "20000000-0000-4000-8000-000000000004": {
    es: {
      name: "Consulta de urgencia",
      category: "Odontología general",
      description:
        "Atención inmediata y diagnóstico prioritario ante dolor agudo, trauma o urgencias funcionales.",
    },
    en: {
      name: "Emergency Consultation",
      category: "General Dentistry",
      description:
        "Prompt assessment and prioritized pain relief for acute dental concerns.",
    },
  },
  "20000000-0000-4000-8000-000000000005": {
    es: {
      name: "Consulta de blanqueamiento",
      category: "Estética dental",
      description:
        "Evaluación de esmalte y definición de protocolo personalizado para blanqueamiento ambulatorio o en sillón.",
    },
    en: {
      name: "Whitening Consultation",
      category: "Cosmetic Dentistry",
      description:
        "Enamel evaluation and personalized whitening protocol planning.",
    },
  },
  "20000000-0000-4000-8000-000000000006": {
    es: {
      name: "Control de ortodoncia",
      category: "Ortodoncia",
      description:
        "Ajuste periódico de aparatología fija o alineadores y seguimiento biomecánico del avance.",
    },
    en: {
      name: "Orthodontic Check",
      category: "Orthodontics",
      description: "Appliance adjustment and alignment progress review.",
    },
  },
  "20000000-0000-4000-8000-000000000007": {
    es: {
      name: "Endodoncia mecanizada",
      category: "Endodoncia",
      description:
        "Tratamiento de conducto radicular con instrumentación rotatoria y obturación tridimensional.",
    },
    en: {
      name: "Root Canal Therapy",
      category: "Endodontics",
      description:
        "Root canal therapy with rotary instrumentation and three-dimensional obturation.",
    },
  },
  "20000000-0000-4000-8000-000000000008": {
    es: {
      name: "Mantenimiento periodontal",
      category: "Periodoncia",
      description:
        "Raspaje subgingival por cuadrante, monitoreo de bolsas periodontales y control de soporte óseo.",
    },
    en: {
      name: "Periodontal Maintenance",
      category: "Periodontics",
      description:
        "Subgingival scaling, periodontal pocket monitoring, and bone support control.",
    },
  },
};

export function getLocalizedTreatment<
  T extends {
    id?: string;
    name: string;
    category?: string;
    description?: string | null;
  },
>(treatment: T, locale: Locale): T {
  let info: LocalizedTreatmentInfo | undefined;
  if (treatment.id) {
    info = treatmentDictionary[treatment.id]?.[locale];
  }
  if (!info) {
    const entry = Object.values(treatmentDictionary).find(
      (dict) =>
        dict.es.name === treatment.name || dict.en.name === treatment.name,
    );
    if (entry) {
      info = entry[locale];
    }
  }
  if (!info) return treatment;

  return {
    ...treatment,
    name: info.name,
    category:
      treatment.category !== undefined ? info.category : treatment.category,
    description:
      treatment.description !== undefined
        ? info.description
        : treatment.description,
  };
}
