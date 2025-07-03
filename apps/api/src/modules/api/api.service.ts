import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

interface QueryParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
}

@Injectable()
export class ApiService {
  constructor(private prisma: PrismaService) {}

  async getPublicEntries(
    workspaceSlug: string,
    contentSlug: string,
    queryParams: QueryParams,
    clientIp: string,
  ) {
    // Find workspace and content type
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { slug: workspaceSlug, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const content = await this.prisma.tbm_content.findFirst({
      where: {
        slug: contentSlug,
        workspace_id: workspace.id,
        is_deleted: false,
      },
      include: {
        field_definitions: {
          where: { is_deleted: false },
          include: {
            relation_to_content: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('Content type not found');
    }

    const { page, limit, sort, order } = queryParams;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.tbm_content_entry.findMany({
        where: {
          content_id: content.id,
          is_deleted: false,
        },
        orderBy: {
          [sort]: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.tbm_content_entry.count({
        where: {
          content_id: content.id,
          is_deleted: false,
        },
      }),
    ]);

    // Process entries to resolve relations
    const processedEntries = await this.processEntriesWithRelations(
      entries,
      content.field_definitions,
    );

    // Log API usage for each entry
    if (entries.length > 0) {
      await this.logApiUsage(content.id, clientIp);
    }

    return {
      data: processedEntries,
      meta: {
        content: {
          id: content.id,
          name: content.name,
          slug: content.slug,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        schema: content.field_definitions.map(field => ({
          name: field.name,
          display_name: field.display_name,
          type: field.type,
          required: field.required,
          multiple: field.multiple,
          relation_to_content: field.relation_to_content,
        })),
      },
    };
  }

  async getPublicEntry(
    workspaceSlug: string,
    contentSlug: string,
    entryId: string,
    clientIp: string,
  ) {
    // Find workspace and content type
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { slug: workspaceSlug, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const content = await this.prisma.tbm_content.findFirst({
      where: {
        slug: contentSlug,
        workspace_id: workspace.id,
        is_deleted: false,
      },
      include: {
        field_definitions: {
          where: { is_deleted: false },
          include: {
            relation_to_content: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('Content type not found');
    }

    const entry = await this.prisma.tbm_content_entry.findFirst({
      where: {
        id: entryId,
        content_id: content.id,
        is_deleted: false,
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    // Process entry to resolve relations
    const processedEntries = await this.processEntriesWithRelations(
      [entry],
      content.field_definitions,
    );

    // Log API usage
    await this.logApiUsage(content.id, clientIp);

    return {
      data: processedEntries[0],
      meta: {
        content: {
          id: content.id,
          name: content.name,
          slug: content.slug,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        schema: content.field_definitions.map(field => ({
          name: field.name,
          display_name: field.display_name,
          type: field.type,
          required: field.required,
          multiple: field.multiple,
          relation_to_content: field.relation_to_content,
        })),
      },
    };
  }

  private async processEntriesWithRelations(entries: any[], fieldDefinitions: any[]) {
    const relationFields = fieldDefinitions.filter(field => field.relation_to_content_id);

    for (const entry of entries) {
      for (const field of relationFields) {
        const fieldValue = entry.data[field.name];
        
        if (fieldValue) {
          if (field.multiple && Array.isArray(fieldValue)) {
            // Handle multiple relations
            const relatedEntries = await this.prisma.tbm_content_entry.findMany({
              where: {
                id: { in: fieldValue },
                content_id: field.relation_to_content_id,
                is_deleted: false,
              },
            });
            entry.data[field.name] = relatedEntries;
          } else if (!field.multiple && typeof fieldValue === 'string') {
            // Handle single relation
            const relatedEntry = await this.prisma.tbm_content_entry.findUnique({
              where: {
                id: fieldValue,
                is_deleted: false,
              },
            });
            entry.data[field.name] = relatedEntry;
          }
        }
      }
    }

    return entries;
  }

  private async logApiUsage(contentId: string, clientIp: string) {
    // Create a system user for anonymous API usage tracking
    // You might want to handle this differently based on your requirements
    try {
      await this.prisma.tbs_content_log.create({
        data: {
          content_id: contentId,
          user_id: 'system', // You might want to create a system user
          ip_address: clientIp,
        },
      });
    } catch (error) {
      // Log error but don't fail the API request
      console.warn('Failed to log API usage:', error.message);
    }
  }
}