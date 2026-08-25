import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    return value || undefined;
  });

const patientFields = {
  email: optionalText,
  firstName: z.string().trim().min(1, "First name is required."),
  identifier: z.string().trim().min(1, "Identifier is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  phone: optionalText,
};

export const createPatientSchema = z.object(patientFields).strict();

export const updatePatientSchema = z.object(patientFields).strict();

export const archivePatientSchema = z.object({}).strict();
