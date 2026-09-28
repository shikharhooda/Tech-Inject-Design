import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { hashLicenseKey } from '@/lib/license';
import { verifyLicenseSchema } from '@tech-inject/validation';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req).catch(() => null);
    if (!user) {
      return jsonError('Authentication required to verify a license', 401);
    }

    const body = await req.json().catch(() => null);
    const parsed = verifyLicenseSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid license key format. Expected TI-PRO-XXXX-XXXX-XXXX-XXXX', 400);
    }

    const { licenseKey } = parsed.data;
    const keyHash = hashLicenseKey(licenseKey);

    const license = await prisma.license.findUnique({
      where: { licenseKeyHash: keyHash },
    });

    if (!license) {
      return jsonError('License key not found or invalid', 404);
    }

    if (license.status === 'REVOKED' || license.revokedAt) {
      return jsonError('This license key has been revoked by an administrator', 403);
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      return jsonError('This license key has expired', 403);
    }

    if (license.userId !== user.id) {
      return jsonError('This license key is assigned to another account', 403);
    }

    // Activate premium status for user
    await prisma.user.update({
      where: { id: user.id },
      data: { premiumAccess: true },
    });

    return jsonSuccess({
      valid: true,
      status: 'ACTIVE',
      expiresAt: license.expiresAt ? license.expiresAt.toISOString() : null,
      message: 'License key verified successfully. Premium access activated.',
    });
  } catch (error) {
    console.error('Error verifying license:', error);
    return jsonError('An error occurred during license verification', 500);
  }
}
