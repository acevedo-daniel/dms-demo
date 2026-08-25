import { z } from "zod";

export const appointmentStatusSchema = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

const appointmentFields = {
  durationMinutes: z.number().int().min(15).max(180).multipleOf(15),
  note: z.string().trim().max(1000).optional(),
  patientId: z.uuid(),
  startsAt: z.coerce.date(),
  treatmentId: z.uuid(),
};

export const createAppointmentSchema = z.object(appointmentFields).strict();

export const updateAppointmentSchema = z
  .object({
    durationMinutes: appointmentFields.durationMinutes.optional(),
    note: appointmentFields.note,
    patientId: appointmentFields.patientId.optional(),
    startsAt: appointmentFields.startsAt.optional(),
    status: appointmentStatusSchema.optional(),
    treatmentId: appointmentFields.treatmentId.optional(),
  })
  .strict()
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "Provide at least one appointment field to update.",
    },
  );

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
