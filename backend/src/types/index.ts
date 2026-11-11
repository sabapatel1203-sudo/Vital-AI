import type { Request } from 'express';

// ─── User Roles ──────────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'doctor' | 'admin';

export const USER_ROLES: readonly UserRole[] = ['patient', 'doctor', 'admin'] as const;

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ─── Auth Request ────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user: JwtPayload;
}

// ─── File Upload ─────────────────────────────────────────────────────────────

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}
