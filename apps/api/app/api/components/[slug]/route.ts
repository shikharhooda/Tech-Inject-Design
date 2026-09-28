import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { getOptionalUser } from '@/lib/auth';
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

    const user = await getOptionalUser(req);
    const hasPremium = user?.premiumAccess === true || user?.role === 'ADMIN';

    const latestVersion = component.versions[0];

    // If FREE or user has authorized premium access
    if (component.access === 'FREE' || hasPremium) {
      return jsonSuccess({
        id: component.id,
        name: component.name,
        slug: component.slug,
        description: component.description,
        category: component.category,
        version: component.version,
        access: component.access,
        status: component.status,
        props: component.props,
        usage: component.usage,
        dependencies: component.dependencies,
        previewData: latestVersion?.previewData ?? component.previewData,
        source: latestVersion?.source ?? '',
        agentPrompt: latestVersion?.agentPrompt ?? component.agentPrompt,
        installCommand: component.installCommand,
        publishedAt: component.publishedAt ? component.publishedAt.toISOString() : null,
        updatedAt: component.updatedAt.toISOString(),
        isLocked: false,
      });
    }

    // PREMIUM component for unauthorized/unauthenticated user: lock private source & prompt
    return jsonSuccess({
      id: component.id,
      name: component.name,
      slug: component.slug,
      description: component.description,
      category: component.category,
      version: component.version,
      access: component.access,
      status: component.status,
      props: component.props,
      usage: component.usage,
      dependencies: [], // Omit dependencies containing premium packages
      installCommand: component.installCommand,
      publishedAt: component.publishedAt ? component.publishedAt.toISOString() : null,
      updatedAt: component.updatedAt.toISOString(),
      isLocked: true,
    });
  } catch (error) {
    console.error('Error fetching component detail:', error);
    return jsonError('Failed to fetch component', 500);
  }
}
