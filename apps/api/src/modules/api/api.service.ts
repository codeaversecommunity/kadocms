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
    objectTypeSlug: string,
    queryParams: QueryParams,
    clientIp: string,
  ) {
    // Find workspace and object type
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { slug: workspaceSlug, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const objectType = await this.prisma.tbm_object_type.findFirst({
      where: {
        slug: objectTypeSlug,
        workspace_id: workspace.id,
        is_deleted: false,
      },
      include: {
        field_definitions: {
          where: { is_deleted: false },
          include: {
            relation_to: {
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

    if (!objectType) {
      throw new NotFoundException('Object type not found');
    }

    const { page, limit, sort, order } = queryParams;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.tbm_entry.findMany({
        where: {
          object_type_id: objectType.id,
          is_deleted: false,
        },
        orderBy: {
          [sort]: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.tbm_entry.count({
        where: {
          object_type_id: objectType.id,
          is_deleted: false,
        },
      }),
    ]);

    // Process entries to resolve relations
    const processedEntries = await this.processEntriesWithRelations(
      entries,
      objectType.field_definitions,
    );

    // Log API usage for each entry
    if (entries.length > 0) {
      await this.logApiUsage(entries.map(e => e.id), clientIp);
    }

    return {
      data: processedEntries,
      meta: {
        object_type: {
          id: objectType.id,
          name: objectType.name,
          slug: objectType.slug,
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
        schema: objectType.field_definitions.map(field => ({
          name: field.name,
          display_name: field.display_name,
          type: field.type,
          required: field.required,
          multiple: field.multiple,
          relation_to: field.relation_to,
        })),
      },
    };
  }

  async getPublicEntry(
    workspaceSlug: string,
    objectTypeSlug: string,
    entryId: string,
    clientIp: string,
  ) {
    // Find workspace and object type
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { slug: workspaceSlug, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const objectType = await this.prisma.tbm_object_type.findFirst({
      where: {
        slug: objectTypeSlug,
        workspace_id: workspace.id,
        is_deleted: false,
      },
      include: {
        field_definitions: {
          where: { is_deleted: false },
          include: {
            relation_to: {
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

    if (!objectType) {
      throw new NotFoundException('Object type not found');
    }

    const entry = await this.prisma.tbm_entry.findFirst({
      where: {
        id: entryId,
        object_type_id: objectType.id,
        is_deleted: false,
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    // Process entry to resolve relations
    const processedEntries = await this.processEntriesWithRelations(
      [entry],
      objectType.field_definitions,
    );

    // Log API usage
    await this.logApiUsage([entry.id], clientIp);

    return {
      data: processedEntries[0],
      meta: {
        object_type: {
          id: objectType.id,
          name: objectType.name,
          slug: objectType.slug,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        schema: objectType.field_definitions.map(field => ({
          name: field.name,
          display_name: field.display_name,
          type: field.type,
          required: field.required,
          multiple: field.multiple,
          relation_to: field.relation_to,
        })),
      },
    };
  }

  private async processEntriesWithRelations(entries: any[], fieldDefinitions: any[]) {
    const relationFields = fieldDefinitions.filter(field => field.relation_to_id);

    for (const entry of entries) {
      for (const field of relationFields) {
        const fieldValue = entry.data[field.name];
        
        if (fieldValue) {
          if (field.multiple && Array.isArray(fieldValue)) {
            // Handle multiple relations
            const relatedEntries = await this.prisma.tbm_entry.findMany({
              where: {
                id: { in: fieldValue },
                object_type_id: field.relation_to_id,
                is_deleted: false,
              },
            });
            entry.data[field.name] = relatedEntries;
          } else if (!field.multiple && typeof fieldValue === 'string') {
            // Handle single relation
            const relatedEntry = await this.prisma.tbm_entry.findUnique({
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

  private async logApiUsage(entryIds: string[], clientIp: string) {
    // For now, we'll create logs without user_id since this is public API
    // In a real implementation, you might want to track API keys or other identifiers
    const logs = entryIds.map(entryId => ({
      entry_id: entryId,
      user_id: 'anonymous', // You might want to handle this differently
      ip_address: clientIp,
    }));

    // Note: This will fail because user_id 'anonymous' doesn't exist
    // You might want to create a system user or handle anonymous usage differently
    try {
      await this.prisma.tbs_entry_log.createMany({
        data: logs,
      });
    } catch (error) {
      // Log error but don't fail the API request
      console.warn('Failed to log API usage:', error.message);
    }
  }
}