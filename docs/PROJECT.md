# DMS — Product overview

> Product scope, workflows, and durable domain rules for the DMS public portfolio demo.

## Product

DMS is a dental practice operations workspace designed around the day-to-day coordination of a single practice. The public portfolio demo uses a fictional sample practice and brings appointments, patient records, a treatment catalog, and operational notes together.

## Problem

Dental practices coordinate connected information throughout the day: who is scheduled, which treatment is planned, what has been recorded, and which appointment needs confirmation. DMS keeps these operational workflows in one clear workspace.

## Actors

| Actor                  | Capabilities / responsibility                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Practice administrator | Coordinates appointments, maintains patient records, uses the treatment catalog, and records operational notes. |

## Scope

### In scope

- A single fictional sample practice and administrator workspace.
- Appointment scheduling, rescheduling, confirmation, completion, cancellation, and conflict feedback.
- Patient records, treatment context from a read-only catalog, and operational notes.
- Responsive workflows with clear loading, empty, error, and confirmation states.

### Out of scope

- Multi-practice administration, branches, and advanced authorization.
- Billing, payments, insurance workflows, messaging, file uploads, and clinical records.

## Core workflows

### Appointment coordination

    Open schedule → select patient and treatment → choose an available time
    → confirm appointment → review, reschedule, or cancel as needed

### Patient follow-up

    Find patient → review record and appointment history → review treatment details
    → add a patient note

## Domain model

### Practice

The sample practice owns the workspace and its operational records.

### Patient

A patient has an identity record, appointment history, related treatment context, and operational notes within the practice.

### Appointment

An appointment connects a patient, a treatment, a scheduled time, duration, and status.

### Treatment

A treatment is a read-only catalog entry that provides service context and a default duration for appointments. Patient notes may optionally reference a treatment.

## Business rules

- Operational records belong to the sample practice.
- Active appointments cannot overlap within the practice.
- Patients are archived instead of being permanently deleted from the workspace.
- Patient notes are linked to a patient and may reference a treatment.
