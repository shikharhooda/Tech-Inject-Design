import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { requirePremium } from '@/lib/auth';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const component = await ComponentService.getPublishedBySlug(slug);

    if (!component) {
      return jsonError('Component not found or unpublished', 404);
    }

    if (component.access === 'PREMIUM') {
      try {
        await requirePremium(req);
      } catch (authErr: any) {
        if (authErr?.message === 'UNAUTHORIZED') {
          return jsonError('Authentication required to install premium component', 401);
        }
        return jsonError('Forbidden: Active premium access required', 403);
      }
    }

    const payload = await ComponentService.getInstallPayload(slug);
    if (!payload) {
      return jsonError('Unable to generate install payload', 500);
    }

    return jsonSuccess(payload);
  } catch (error) {
    console.error('Error fetching install payload:', error);
    return jsonError('Internal server error', 500);
  }
}
