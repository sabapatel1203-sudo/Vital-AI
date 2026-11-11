import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function optionalInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer, got: "${value}"`);
  }
  return parsed;
}

export const env = {
  // Server
  port: optionalInt('PORT', 3001),
  nodeEnv: optional('NODE_ENV', 'development'),
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isTest() {
    return this.nodeEnv === 'test';
  },

  // Database
  databaseUrl: required('DATABASE_URL'),

  // JWT
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  jwtRefreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '30d'),

  // File Upload
  uploadDir: optional('UPLOAD_DIR', './uploads'),
  maxFileSizeMb: optionalInt('MAX_FILE_SIZE_MB', 50),
  get maxFileSizeBytes() {
    return this.maxFileSizeMb * 1024 * 1024;
  },

  // AI Provider
  aiProvider: optional('AI_PROVIDER', 'openai'),
  aiApiKey: optional('AI_API_KEY', ''),
  aiModel: optional('AI_MODEL', 'gpt-4o'),

  // CORS
  frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),
} as const;

export const config = env;
export default env;
