// ─── Base Application Error ──────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── 400 Bad Request ─────────────────────────────────────────────────────────

export class ValidationError extends AppError {
  public readonly errors?: Array<{ field?: string; message: string }>;

  constructor(
    message = 'Validation failed',
    errors?: Array<{ field?: string; message: string }>,
  ) {
    super(message, 400);
    this.errors = errors;
  }
}

// ─── 401 Unauthorized ────────────────────────────────────────────────────────

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

// ─── 403 Forbidden ───────────────────────────────────────────────────────────

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

// ─── 404 Not Found ───────────────────────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// ─── 409 Conflict ────────────────────────────────────────────────────────────

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}
