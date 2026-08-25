# DMS — Product overview

> Product scope, workflows, and domain rules for the public DMS edition.

## Product

DMS is a SaaS-oriented dental management system for organizing the daily operation of a dental practice. Its public edition presents a focused workspace for a sample practice, bringing appointments, patient records, treatment tracking, and patient notes together.

## Problem

Dental practices coordinate connected information throughout the day: who is scheduled, which treatment is planned, what has been recorded, and which appointment needs confirmation. DMS keeps these operational workflows in one clear workspace.

## Actors

| Actor | Capabilities / responsibility |
| --- | --- |
| Practice administrator | Coordinates appointments, maintains patient records, tracks treatments, and records patient notes. |

## Scope

### In scope

- A single sample practice and administrator workspace.
- Appointment scheduling, rescheduling, cancellation, and conflict feedback.
- Patient records, treatment tracking, and patient notes.
- Responsive workflows with clear loading, empty, error, and confirmation states.

### Out of scope

- Multi-practice administration, branches, and advanced permissions.
- Billing, payments, insurance workflows, messaging, and file uploads.

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

A patient has a profile, appointment history, treatments, and patient notes within the practice.

### Appointment

An appointment connects a patient, a treatment, a scheduled time, duration, and status.

### Treatment

A treatment provides the service context for appointments and patient notes.

## Business rules

- Operational records belong to the sample practice.
- Active appointments for the same professional cannot overlap.
- Patients are archived instead of being permanently deleted from the workspace.
- Patient notes are linked to a patient and may reference a treatment.
