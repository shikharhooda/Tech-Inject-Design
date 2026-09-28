import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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

    if (!user) return jsonError('Customer not found', 404);

    return jsonSuccess({
      id: user.id,
      email: user.email,
      role: user.role,
      premiumAccess: user.premiumAccess,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      licenses: user.licenses.map((l) => ({
        id: l.id,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
        expiresAt: l.expiresAt ? l.expiresAt.toISOString() : null,
        revokedAt: l.revokedAt ? l.revokedAt.toISOString() : null,
      })),
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error fetching customer:', err);
    return jsonError('Internal server error', 500);
  }
}
