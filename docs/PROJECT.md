# DMS — Project

> Product scope, domain rules, and business constraints for the DMS workspace.

## Product

DMS is a dental practice operations workspace built around the coordination work that happens throughout the day. The public experience uses Atelier Dental, a fictional sample practice, to connect appointments, patient records, treatment context, and operational notes in one place.

## Problem

Dental practices coordinate connected information continuously: who is scheduled, which treatment is planned, what has been recorded, and which appointment needs attention. DMS keeps these workflows together without forcing the team to move between disconnected tools.

## Scope

### In scope

- A single fictional practice and administrator workspace.
- Appointment scheduling, rescheduling, confirmation, completion, cancellation, and active-conflict prevention.
- A patient directory and patient records.
- Treatment context from a read-only catalog.
- Operational notes associated with patients and, when relevant, treatments.
- Responsive loading, empty, no-results, error, and confirmation states.
- Guided, resettable public access without a registration flow.

### Out of scope

- Multi-practice administration, branches, and advanced role-based access control.
- Billing, invoicing, payments, insurance claims, messaging, and file uploads.
- Full clinical records, odontograms, diagnoses, medical imaging, and charting.
- Automated reminders, external calendar integrations, and analytics dashboards.

## Core workflows

### Appointment coordination

    Open the schedule -> choose a patient and treatment -> select an available time
    -> create the appointment -> confirm, reschedule, complete, or cancel as needed

### Patient follow-up

    Find a patient -> review the record, next appointment, and activity history
    -> review treatment details -> add or edit an operational note

## Business rules

- **Practice ownership:** Every operational record belongs to the sample practice.
- **Appointment overlap:** Active appointments, SCHEDULED and CONFIRMED, cannot overlap within the practice.
- **Soft deletion:** Patients are archived instead of permanently deleted so historical context remains available.
- **Archive constraint:** A patient with future active appointments cannot be archived until those appointments are completed or cancelled.
- **Note associations:** Operational notes belong to an active patient and may optionally reference a treatment.
- **Catalog authority:** Treatments are read-only catalog entries that provide service context and default appointment durations.

## Current limitations

- The public experience is bounded to one fictional practice.
- The practice administrator is the sole operational actor.
- Treatment definitions are read-only in the interface.

## Provenance

DMS is an independent demonstration informed by operational systems delivered with a small team for a dental practice client. It contains no real patient, client, or clinical data.

## Related documentation

- [README.md](../README.md) — project entry point, local setup, and capabilities.
- [ARCHITECTURE.md](ARCHITECTURE.md) — system topology, boundaries, and invariants.
- [DEVELOPMENT.md](DEVELOPMENT.md) — developer setup, database commands, and workflow.
- [TESTING.md](TESTING.md) — test strategy, commands, and release gates.
- [SECURITY.md](../.github/SECURITY.md) — vulnerability reporting and demo-data guidance.
