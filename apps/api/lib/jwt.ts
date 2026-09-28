import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '@tech-inject/types';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'tech-inject-super-secret-jwt-key-for-development-do-not-use-in-production-32char';

export function signToken(payload: { userId: string; role: 'CUSTOMER' | 'ADMIN' }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
