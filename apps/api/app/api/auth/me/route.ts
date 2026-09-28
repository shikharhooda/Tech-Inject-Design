import { NextRequest } from 'next/server';
import { getOptionalUser } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getOptionalUser(req);
    if (!user) {
      return jsonError('Unauthenticated', 401);
    }

    return jsonSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        premiumAccess: user.premiumAccess,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return jsonError('Internal server error', 500);
  }
}
