import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { requireAdmin } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const published = await ComponentService.publish(params.id);
    return jsonSuccess({
      message: 'Component published successfully',
      component: published,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error publishing component:', err);
    return jsonError(err.message || 'Internal server error', 400);
  }
}
