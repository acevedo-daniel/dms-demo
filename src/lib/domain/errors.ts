import { ZodError } from "zod";

type ErrorDetails = Record<string, unknown> | undefined;

export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly details?: ErrorDetails,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class AuthenticationError extends DomainError {
  constructor() {
    super("UNAUTHENTICATED", 401, "Authentication is required.");
  }
}

export class AuthorizationError extends DomainError {
  constructor() {
    super("FORBIDDEN", 403, "This action is not available for this session.");
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: ErrorDetails) {
    super("CONFLICT", 409, message, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super("NOT_FOUND", 404, `${resource} was not found.`);
  }
}

export class ValidationError extends DomainError {
  constructor(error: ZodError) {
    super("VALIDATION_ERROR", 422, "The submitted data is invalid.", {
      issues: error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path.join("."),
      })),
    });
  }
}
