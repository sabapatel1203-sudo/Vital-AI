import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload, UserRole } from '../types/index.js';

export function generateAccessToken(payload: { userId: string; email: string; role: UserRole }): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

