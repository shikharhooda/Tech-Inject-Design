import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { requireAdmin } from '@/lib/auth';
import { componentUpdateSchema } from '@tech-inject/validation';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const component = await ComponentService.getById(params.id);
    if (!component) return jsonError('Component not found', 404);
    return jsonSuccess(component);
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error fetching admin component:', err);
    return jsonError('Internal server error', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const parsed = componentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid update payload', 400, parsed.error.format());
    }

    const updated = await ComponentService.update(params.id, parsed.data);
    if (!updated) return jsonError('Component not found', 404);

    return jsonSuccess(updated);
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error updating component:', err);
    return jsonError('Internal server error', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    await ComponentService.delete(params.id);
    return jsonSuccess({ message: 'Component deleted successfully' });
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error deleting component:', err);
    return jsonError('Internal server error', 500);
  }
}
