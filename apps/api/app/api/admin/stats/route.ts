import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const [
      totalComponents,
      publishedComponents,
      draftComponents,
      premiumComponents,
      totalCustomers,
      activeLicenses,
    ] = await Promise.all([
      prisma.component.count(),
      prisma.component.count({ where: { status: 'PUBLISHED' } }),
      prisma.component.count({ where: { status: 'DRAFT' } }),
      prisma.component.count({ where: { access: 'PREMIUM' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.license.count({ where: { status: 'ACTIVE' } }),
    ]);

    return jsonSuccess({
      totalComponents,
      publishedComponents,
      draftComponents,
      premiumComponents,
      totalCustomers,
      activeLicenses,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error fetching admin stats:', err);
    return jsonError('Internal server error', 500);
  }
}
