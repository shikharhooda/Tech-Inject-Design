import { prisma } from './prisma';
import { ComponentBundleInput, ComponentUpdateInput, InstallPayload } from '@tech-inject/types';
import { Access, Status, Prisma } from '@prisma/client';

export class ComponentService {
  /**
   * List only published components for the public catalogue
   */
  static async listPublished(filters?: {
    search?: string;
    category?: string;
    access?: string;
  }) {
    const where: Prisma.ComponentWhereInput = {
      status: 'PUBLISHED',
    };

    if (filters?.category && filters.category !== 'All') {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    if (filters?.access && filters.access !== 'ALL') {
      where.access = filters.access as Access;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ];
    }

    const components = await prisma.component.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        version: true,
        access: true,
        status: true,
        installCommand: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    return components;
  }

  /**
   * Get single published component by slug
   */
  static async getPublishedBySlug(slug: string) {
    const component = await prisma.component.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return component;
  }

  /**
   * Get authorized install payload for component
   */
  static async getInstallPayload(slug: string): Promise<InstallPayload | null> {
    const component = await this.getPublishedBySlug(slug);
    if (!component) return null;

    // Use latest published version source
    const latestVersion = component.versions[0];
    const source = latestVersion?.source || '';
    const dependencies = (latestVersion?.dependencies || component.dependencies) as string[];

    return {
      slug: component.slug,
      name: component.name,
      version: component.version,
      dependencies,
      installCommand: component.installCommand,
      files: [
        {
          path: `${component.slug}.tsx`,
          content: source,
        },
      ],
    };
  }

  /**
   * Admin: List all components (including drafts and unpublished)
   */
  static async listAdminAll() {
    return prisma.component.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { versions: true },
        },
      },
    });
  }

  /**
   * Admin: Get component by ID
   */
  static async getById(id: string) {
    return prisma.component.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Admin: Create a new component
   */
  static async create(data: ComponentBundleInput) {
    const defaultInstallCmd = data.installCommand || `npx tech-inject add ${data.slug}`;

    const component = await prisma.component.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        version: data.version,
        access: data.access as Access,
        status: (data.status as Status) || 'DRAFT',
        props: data.props as unknown as Prisma.InputJsonValue,
        usage: data.usage,
        dependencies: data.dependencies as unknown as Prisma.InputJsonValue,
        previewData: data.previewData as unknown as Prisma.InputJsonValue,
        agentPrompt: data.agentPrompt,
        installCommand: defaultInstallCmd,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        versions: {
          create: {
            version: data.version,
            source: data.source,
            previewData: data.previewData as unknown as Prisma.InputJsonValue,
            dependencies: data.dependencies as unknown as Prisma.InputJsonValue,
            installData: { installCommand: defaultInstallCmd },
            agentPrompt: data.agentPrompt,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    return component;
  }

  /**
   * Admin: Update component
   */
  static async update(id: string, data: ComponentUpdateInput) {
    const existing = await prisma.component.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!existing) return null;

    const shouldCreateVersion =
      (data.version && data.version !== existing.version) ||
      (data.source && data.source !== existing.versions[0]?.source);

    const updateData: Prisma.ComponentUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.access !== undefined) updateData.access = data.access as Access;
    if (data.status !== undefined) updateData.status = data.status as Status;
    if (data.props !== undefined) updateData.props = data.props as unknown as Prisma.InputJsonValue;
    if (data.usage !== undefined) updateData.usage = data.usage;
    if (data.dependencies !== undefined) updateData.dependencies = data.dependencies as unknown as Prisma.InputJsonValue;
    if (data.previewData !== undefined) updateData.previewData = data.previewData as unknown as Prisma.InputJsonValue;
    if (data.agentPrompt !== undefined) updateData.agentPrompt = data.agentPrompt;
    if (data.installCommand !== undefined) updateData.installCommand = data.installCommand;

    if (shouldCreateVersion) {
      const newVersion = data.version || existing.version;
      const newSource = data.source || existing.versions[0]?.source || '';
      const newPreviewData = data.previewData || existing.previewData;
      const newDeps = data.dependencies || existing.dependencies;
      const newPrompt = data.agentPrompt || existing.agentPrompt;

      updateData.versions = {
        create: {
          version: newVersion,
          source: newSource,
          previewData: newPreviewData as unknown as Prisma.InputJsonValue,
          dependencies: newDeps as unknown as Prisma.InputJsonValue,
          installData: { installCommand: updateData.installCommand || existing.installCommand },
          agentPrompt: newPrompt,
        },
      };
    }

    return prisma.component.update({
      where: { id },
      data: updateData,
      include: { versions: { orderBy: { createdAt: 'desc' } } },
    });
  }

  /**
   * Admin: Validate component bundle before publishing
   */
  static async validate(id: string) {
    const component = await prisma.component.findUnique({
      where: { id },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!component) return { valid: false, errors: ['Component not found'] };

    const errors: string[] = [];
    if (!component.name || component.name.length < 2) errors.push('Component name must be at least 2 characters');
    if (!component.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(component.slug)) errors.push('Invalid component slug format');
    if (!component.description || component.description.length < 5) errors.push('Description too short (min 5 chars)');
    if (!component.version || !/^\d+\.\d+\.\d+$/.test(component.version)) errors.push('Invalid version semver (e.g. 1.0.0)');

    const latestVer = component.versions[0];
    if (!latestVer || !latestVer.source || latestVer.source.length < 10) {
      errors.push('Component must have valid source code (min 10 chars)');
    }
    if (!component.agentPrompt || component.agentPrompt.length < 10) {
      errors.push('AI agent prompt is required for publishing');
    }

    return {
      valid: errors.length === 0,
      errors,
      componentId: component.id,
      slug: component.slug,
      version: component.version,
    };
  }

  /**
   * Admin: Publish component
   */
  static async publish(id: string) {
    const validation = await this.validate(id);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return prisma.component.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Admin: Unpublish component
   */
  static async unpublish(id: string) {
    return prisma.component.update({
      where: { id },
      data: {
        status: 'UNPUBLISHED',
      },
    });
  }

  /**
   * Admin: Delete component
   */
  static async delete(id: string) {
    return prisma.component.delete({
      where: { id },
    });
  }
}
