import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const appointmentStatus = pgEnum("appointment_status", [
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const practices = pgTable("practices", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  timezone: text("timezone")
    .notNull()
    .default("America/Argentina/Buenos_Aires"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const patients = pgTable(
  "patients",
  {
    id: uuid("id").primaryKey(),
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id, { onDelete: "cascade" }),
    identifier: text("identifier").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("patients_practice_identifier_unique").on(
      table.practiceId,
      table.identifier,
    ),
    index("patients_practice_name_index").on(
      table.practiceId,
      table.lastName,
      table.firstName,
    ),
  ],
);

export const treatments = pgTable(
  "treatments",
  {
    id: uuid("id").primaryKey(),
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    defaultDurationMinutes: integer("default_duration_minutes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("treatments_practice_name_unique").on(
      table.practiceId,
      table.name,
    ),
  ],
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey(),
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "restrict" }),
    treatmentId: uuid("treatment_id")
      .notNull()
      .references(() => treatments.id, { onDelete: "restrict" }),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    status: appointmentStatus("status").notNull().default("SCHEDULED"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("appointments_practice_starts_at_index").on(
      table.practiceId,
      table.startsAt,
    ),
    index("appointments_patient_starts_at_index").on(
      table.patientId,
      table.startsAt,
    ),
  ],
);

export const patientNotes = pgTable(
  "patient_notes",
  {
    id: uuid("id").primaryKey(),
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    treatmentId: uuid("treatment_id").references(() => treatments.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("patient_notes_patient_created_at_index").on(
      table.patientId,
      table.createdAt,
    ),
  ],
);

export const practicesRelations = relations(practices, ({ many }) => ({
  patients: many(patients),
  treatments: many(treatments),
  appointments: many(appointments),
  patientNotes: many(patientNotes),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  practice: one(practices, {
    fields: [patients.practiceId],
    references: [practices.id],
  }),
  appointments: many(appointments),
  notes: many(patientNotes),
}));

export const treatmentsRelations = relations(treatments, ({ one, many }) => ({
  practice: one(practices, {
    fields: [treatments.practiceId],
    references: [practices.id],
  }),
  appointments: many(appointments),
  notes: many(patientNotes),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  practice: one(practices, {
    fields: [appointments.practiceId],
    references: [practices.id],
  }),
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  treatment: one(treatments, {
    fields: [appointments.treatmentId],
    references: [treatments.id],
  }),
}));

export const patientNotesRelations = relations(patientNotes, ({ one }) => ({
  practice: one(practices, {
    fields: [patientNotes.practiceId],
    references: [practices.id],
  }),
  patient: one(patients, {
    fields: [patientNotes.patientId],
    references: [patients.id],
  }),
  treatment: one(treatments, {
    fields: [patientNotes.treatmentId],
    references: [treatments.id],
  }),
}));
