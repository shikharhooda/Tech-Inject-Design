import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return jsonError('Customer not found', 404);
    }

    const now = new Date();

    // Revoke all active licenses and set user.premiumAccess = false
    await prisma.$transaction([
      prisma.license.updateMany({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        data: {
          status: 'REVOKED',
          revokedAt: now,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          premiumAccess: false,
        },
      }),
    ]);

    return jsonSuccess({
      message: 'Premium access successfully revoked',
      userId: user.id,
      email: user.email,
      premiumAccess: false,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error revoking premium:', err);
    return jsonError('Internal server error', 500);
  }
}
