ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'ARRIVED';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS clinical_alert text;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS operatory integer NOT NULL DEFAULT 1;
ALTER TABLE appointments ADD CONSTRAINT appointments_operatory_check CHECK (operatory IN (1, 2));
