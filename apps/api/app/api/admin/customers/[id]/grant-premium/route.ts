import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { generateLicenseKey, hashLicenseKey } from '@/lib/license';
import { grantPremiumSchema } from '@tech-inject/validation';
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

    const body = await req.json().catch(() => ({}));
    const parsed = grantPremiumSchema.safeParse(body);
    const expiresAt = parsed.success && parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;

    // Generate random raw license key: TI-PRO-XXXX-XXXX-XXXX-XXXX
    const rawLicenseKey = generateLicenseKey();
    const licenseHash = hashLicenseKey(rawLicenseKey);

    // Create active license record and grant user premium access
    await prisma.$transaction([
      prisma.license.create({
        data: {
          userId: user.id,
          licenseKeyHash: licenseHash,
          status: 'ACTIVE',
          expiresAt,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { premiumAccess: true },
      }),
    ]);

    // Return the raw license key once in response
    return jsonSuccess({
      message: 'Premium access successfully granted',
      userId: user.id,
      email: user.email,
      licenseKey: rawLicenseKey, // Only shown once!
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error granting premium:', err);
    return jsonError('Internal server error', 500);
  }
}
