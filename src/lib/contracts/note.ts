import { z } from "zod";

const optionalTreatmentId = z
  .union([z.uuid(), z.literal("")])
  .optional()
  .transform((value) => value || undefined);

const noteFields = {
  body: z.string().trim().min(1, "A note is required."),
  patientId: z.uuid(),
  treatmentId: optionalTreatmentId,
};

export const createPatientNoteSchema = z.object(noteFields).strict();
export const updatePatientNoteSchema = z.object(noteFields).strict();
