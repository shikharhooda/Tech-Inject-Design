import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { verifyToken } from './jwt';
import { hashLicenseKey } from './license';
import { User, Role } from '@prisma/client';

export interface AuthContext {
  user: User;
}

/**
 * Extracts auth token from cookies or Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check HTTP-only cookie
  const cookie = req.cookies.get('auth_token');
  if (cookie?.value) {
    return cookie.value;
  }

  return null;
}

/**
 * Checks optional authenticated user. Returns null if unauthenticated.
 */
export async function getOptionalUser(req: NextRequest): Promise<User | null> {
  const token = extractToken(req);

  // If token is provided, verify it
  if (token) {
    const payload = verifyToken(token);
    if (payload?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (user) return user;
    }
  }

  // If x-license-key header is provided, check if valid active license exists
  const licenseKey = req.headers.get('x-license-key');
  if (licenseKey) {
    const hash = hashLicenseKey(licenseKey);
    const license = await prisma.license.findUnique({
      where: { licenseKeyHash: hash },
      include: { user: true },
    });

    if (
      license &&
      license.status === 'ACTIVE' &&
      (!license.expiresAt || license.expiresAt > new Date()) &&
      license.user
    ) {
      return license.user;
    }
  }

  return null;
}

/**
 * Require valid authenticated user. Throws Response if unauthorized.
 */
export async function requireAuth(req: NextRequest): Promise<User> {
  const user = await getOptionalUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Require ADMIN role. Throws Response if unauthorized or forbidden.
 */
export async function requireAdmin(req: NextRequest): Promise<User> {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN_ADMIN');
  }
  return user;
}

/**
 * Require user with active premium access. Throws Response if unauthorized or forbidden.
 */
export async function requirePremium(req: NextRequest): Promise<User> {
  const user = await requireAuth(req);
  if (!user.premiumAccess) {
    throw new Error('FORBIDDEN_PREMIUM');
  }
  return user;
}
