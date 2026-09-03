# DMS — Project

> Product scope, domain rules, and business constraints for the DMS public portfolio demo.

## Product

DMS is a dental practice operations workspace designed around the day-to-day coordination of a single practice. The public portfolio demo uses a fictional sample practice (Atelier Dental) and brings appointments, patient records, a treatment catalog, and operational notes together.

## Problem

Dental practices coordinate connected information throughout the day: who is scheduled, which treatment is planned, what has been recorded, and which appointment needs confirmation. DMS keeps these operational workflows connected in one workspace without jumping between disconnected tools.

## Scope

### In scope

- A single fictional sample practice and administrator workspace.
- Appointment scheduling, rescheduling, confirmation, completion, cancellation, and active conflict prevention.
- Patient directory and records, treatment context from a read-only catalog, and operational notes.
- Responsive workflows with clear loading, empty, no-results, error, and confirmation states.
- Guided, resettable public demo access without a public registration flow.

### Out of scope

- Multi-practice administration, branches, and advanced role-based access control.
- Billing, invoicing, payments, insurance claims, messaging, and file uploads.
- Clinical records, odontograms, clinical charting, diagnoses, and medical imaging.
- Automated reminders, external calendar integrations, and analytics/KPI dashboards.

## Core workflows

### Appointment coordination

```text
Open schedule → select patient and treatment → choose available time slot
→ create appointment → confirm, reschedule, complete, or cancel as needed
```

### Patient follow-up

```text
Find patient → review record, next appointment, and activity history
→ review treatment details → add or edit operational patient note
```

## Business rules

- **Practice ownership:** All operational records belong to the sample practice.
- **Appointment overlap:** Active appointments (Scheduled, Confirmed) cannot overlap within the practice.
- **Soft deletion:** Patients are archived instead of being permanently deleted to preserve historical context.
- **Archive constraint:** Patients with active future appointments cannot be archived until those appointments are completed or cancelled.
- **Note associations:** Operational notes must be linked to an active patient and may optionally reference a treatment.
- **Catalog authority:** Treatments are read-only catalog entries providing service context and default appointment durations.

## Current limitations

- Bounded to a single fictional practice in public demo mode.
- Practice administrator is the sole operational actor.
- Treatment definitions are read-only and cannot be modified in the interface.

## Provenance

Independent public portfolio demo informed by operational systems delivered with a small team for a dental practice client. Every practice, patient, and record is fictional.

## Related documentation

- [README.md](../README.md) — project entry point, architecture, and local development.
- [SECURITY.md](../.github/SECURITY.md) — vulnerability reporting policy and demo data privacy guidelines.
