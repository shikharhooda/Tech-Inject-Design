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
    const unpublished = await ComponentService.unpublish(params.id);
    return jsonSuccess({
      message: 'Component unpublished successfully',
      component: unpublished,
    });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error unpublishing component:', err);
    return jsonError(err.message || 'Internal server error', 500);
  }
}
