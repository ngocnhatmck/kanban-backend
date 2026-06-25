/**
 * Utility functions cho JWT & Password
 */

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import JWT_CONFIG from '../config/jwt.js';
import { JWTPayload } from '../types/index.js';

/**
 * Generate JWT token
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
    } as Omit<JWTPayload, 'iat' | 'exp'>,
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn as any }
  );
}

/**
 * Generate Refresh token
 */
export function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
    } as Omit<JWTPayload, 'iat' | 'exp'>,
    JWT_CONFIG.refreshSecret,
    { expiresIn: JWT_CONFIG.refreshExpiresIn as any }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verify Refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_CONFIG.refreshSecret) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare password with hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}
