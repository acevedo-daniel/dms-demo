# DMS — Project

> Product scope, domain rules, and business constraints for the DMS workspace.

## Product

DMS is a dental practice operations workspace built around the coordination work that happens throughout the clinic day. The public experience uses Atelier Dental, a fictional sample practice, to connect appointments, patient records, treatment context, and operational notes into a single cohesive environment.

## Problem

Dental practices coordinate connected information continuously: who is scheduled, which treatment is planned, what medical alerts must be kept front of mind when welcoming a patient, and which notes need attention before tomorrow's first arrival. DMS keeps these workflows together without forcing the team to juggle disconnected spreadsheets or fragmented software tools.

## Scope

### In scope

- A single fictional practice environment configured with two operatories and a Lead Dentist role.
- Appointment scheduling, rescheduling, confirmation, arrival tracking in reception, completion, cancellation, and active conflict prevention per operatory.
- A patient directory and connected patient records with medical alerts (e.g. allergies, hypertension) and visit histories.
- A read-only treatment catalog providing standardized service definitions and default duration baselines.
- Clinical and operational notes associated with patients and, optionally, specific treatments.
- A printable Daily Huddle clinical brief for morning team alignment.
- Accessible loading, empty, no-results, error, and confirmation states across keyboard and screen reader interactions.
- Guided public demo access provisioned on the server, complete with instant baseline data restoration.

### Out of scope

- Multi-practice tenancy, organizational hierarchies, and granular custom role-based access control.
- Invoicing, billing, payment gateways, insurance claims processing, and file attachments.
- Full hospital-grade clinical charting, interactive odontograms, diagnostic medical imaging, or DICOM x-rays.
- Automated SMS/WhatsApp patient notifications, external calendar sync, and marketing analytics dashboards.

## Core workflows

### Appointment coordination

```text
Open schedule -> select patient and treatment -> pick available slot in operatory 1 or 2
-> create appointment -> confirm, mark arrived, complete, or cancel as the clinic day evolves
```

### Patient follow-up and care

```text
Find patient in directory -> review record, medical alerts, and upcoming appointment
-> check planned treatment -> record clinical note or follow-up observation
```

## Business rules

- **Practice ownership:** Every operational record (appointments, patients, notes) strictly belongs to the active practice.
- **Operatory conflict prevention:** Active appointments (`SCHEDULED` or `CONFIRMED`) cannot overlap within the same operatory during the same time window.
- **Soft deletion:** Patients are archived rather than permanently deleted, preserving chronological visit history.
- **Archive constraint:** A patient with future active appointments cannot be archived until those appointments are completed or cancelled.
- **Note associations:** Operational notes belong to an active patient and may optionally reference a treatment from the catalog.
- **Catalog authority:** Treatments are read-only catalog entries that standardize clinical categories and default appointment durations.

## Current limitations

- The public demonstration is intentionally bounded to one fictional practice (Atelier Dental).
- Demo sessions operate under a pre-provisioned Lead Dentist persona.
- Treatment definitions are reference-only and cannot be created or modified from the interface.

## Provenance

DMS is an independent demonstration informed by operational systems built for real-world dental clinics. All patient names, identification numbers, telephone numbers, clinical alerts, and notes in this repository are strictly fictional.

## Related documentation

- [README.md](../README.md) — project overview, live demo link, and local setup.
- [ARCHITECTURE.md](ARCHITECTURE.md) — system topology, component boundaries, and invariants.
- [DEVELOPMENT.md](DEVELOPMENT.md) — local environment configuration, environment variables, and database workflow.
- [TESTING.md](TESTING.md) — test strategy, verification commands, and CI pipeline.
- [SECURITY.md](../.github/SECURITY.md) — private vulnerability reporting and demo-data safety guidelines.
