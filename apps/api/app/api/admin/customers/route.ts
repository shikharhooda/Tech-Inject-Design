import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        premiumAccess: true,
        createdAt: true,
        updatedAt: true,
        licenses: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            expiresAt: true,
            revokedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      premiumAccess: u.premiumAccess,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      licenses: u.licenses.map((l) => ({
        id: l.id,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
        expiresAt: l.expiresAt ? l.expiresAt.toISOString() : null,
        revokedAt: l.revokedAt ? l.revokedAt.toISOString() : null,
      })),
    }));

    return jsonSuccess(formatted);
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error listing customers:', err);
    return jsonError('Internal server error', 500);
  }
}
