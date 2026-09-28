import { NextRequest } from 'next/server';
import { ComponentService } from '@/lib/component-service';
import { jsonSuccess, jsonError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const access = searchParams.get('access') || undefined;

    const components = await ComponentService.listPublished({
      search,
      category,
      access,
    });

    const formatted = components.map((c) => ({
      ...c,
      publishedAt: c.publishedAt ? c.publishedAt.toISOString() : null,
      updatedAt: c.updatedAt.toISOString(),
    }));

    return jsonSuccess(formatted);
  } catch (error) {
    console.error('Error fetching components:', error);
    return jsonError('Failed to fetch components', 500);
  }
}
