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
          return jsonError('Authentication required to access premium preview', 401);
        }
        return jsonError('Forbidden: Active premium access required', 403);
      }
    }

    const latestVersion = component.versions[0];

    return jsonSuccess({
      slug: component.slug,
      name: component.name,
      version: component.version,
      previewData: latestVersion?.previewData ?? component.previewData,
      props: component.props,
    });
  } catch (error) {
    console.error('Error fetching component preview:', error);
    return jsonError('Internal server error', 500);
  }
}
