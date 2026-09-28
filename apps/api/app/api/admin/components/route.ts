import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { requireAdmin } from '@/lib/auth';
import { componentBundleSchema } from '@tech-inject/validation';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const components = await ComponentService.listAdminAll();
    return jsonSuccess(components);
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error listing admin components:', err);
    return jsonError('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const parsed = componentBundleSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Invalid component bundle payload', 400, parsed.error.format());
    }

    const component = await ComponentService.create(parsed.data);
    return jsonSuccess(component, 201);
  } catch (err: any) {
    if (err?.message === 'UNAUTHORIZED') return jsonError('Authentication required', 401);
    if (err?.message === 'FORBIDDEN_ADMIN') return jsonError('Admin access required', 403);
    console.error('Error creating component:', err);
    return jsonError(err.message || 'Internal server error', 500);
  }
}
