import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateEntryDto, UpdateEntryDto, QueryEntriesDto } from './dto/entry.dto';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEntryDto: CreateEntryDto, creatorId: string) {
    // Get object type with field definitions
    const objectType = await this.prisma.tbm_object_type.findUnique({
      where: { id: createEntryDto.object_type_id, is_deleted: false },
      include: {
        field_definitions: {
          where: { is_deleted: false },
        },
        workspace: true,
      },
    });

    if (!objectType) {
      throw new NotFoundException('Object type not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: objectType.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: creatorId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== creatorId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    // Validate data against field definitions
    this.validateEntryData(createEntryDto.data, objectType.field_definitions);

    return this.prisma.tbm_entry.create({
      data: {
        ...createEntryDto,
        creator_id: creatorId,
      },
      include: {
        object_type: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
            username: true,
          },
        },
      },
    });
  }

  async findAll(queryDto: QueryEntriesDto, userId: string) {
    const { object_type_id, workspace_id, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = queryDto;

    let whereClause: any = { is_deleted: false };

    if (object_type_id) {
      whereClause.object_type_id = object_type_id;
    }

    if (workspace_id) {
      whereClause.object_type = {
        workspace_id: workspace_id,
      };
    }

    // Check workspace access if workspace_id is provided
    if (workspace_id) {
      const workspace = await this.prisma.tbm_workspace.findUnique({
        where: { id: workspace_id, is_deleted: false },
        include: {
          members: {
            where: { user_id: userId, status: 'Active' },
          },
        },
      });

      if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
        throw new ForbiddenException('You do not have access to this workspace');
      }
    }

    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.tbm_entry.findMany({
        where: whereClause,
        include: {
          object_type: {
            select: {
              id: true,
              name: true,
              slug: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          creator: {
            select: {
              id: true,
              email: true,
              full_name: true,
              username: true,
            },
          },
        },
        orderBy: {
          [sort]: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.tbm_entry.count({
        where: whereClause,
      }),
    ]);

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const entry = await this.prisma.tbm_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        object_type: {
          include: {
            field_definitions: {
              where: { is_deleted: false },
            },
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
            username: true,
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.object_type.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return entry;
  }

  async update(id: string, updateEntryDto: UpdateEntryDto, userId: string) {
    const entry = await this.prisma.tbm_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        object_type: {
          include: {
            field_definitions: {
              where: { is_deleted: false },
            },
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.object_type.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    // Validate data against field definitions
    if (updateEntryDto.data) {
      this.validateEntryData(updateEntryDto.data, entry.object_type.field_definitions);
    }

    return this.prisma.tbm_entry.update({
      where: { id },
      data: {
        ...updateEntryDto,
        modifier_id: userId,
        updated_at: new Date(),
      },
      include: {
        object_type: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
            username: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const entry = await this.prisma.tbm_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        object_type: true,
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.object_type.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return this.prisma.tbm_entry.update({
      where: { id },
      data: { 
        is_deleted: true, 
        modifier_id: userId,
        updated_at: new Date() 
      },
    });
  }

  private validateEntryData(data: Record<string, any>, fieldDefinitions: any[]) {
    for (const field of fieldDefinitions) {
      if (field.required && (data[field.name] === undefined || data[field.name] === null)) {
        throw new BadRequestException(`Field '${field.display_name}' is required`);
      }

      if (data[field.name] !== undefined) {
        // Basic type validation
        switch (field.type) {
          case 'NUMBER':
            if (typeof data[field.name] !== 'number') {
              throw new BadRequestException(`Field '${field.display_name}' must be a number`);
            }
            break;
          case 'BOOLEAN':
            if (typeof data[field.name] !== 'boolean') {
              throw new BadRequestException(`Field '${field.display_name}' must be a boolean`);
            }
            break;
          case 'EMAIL':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data[field.name])) {
              throw new BadRequestException(`Field '${field.display_name}' must be a valid email`);
            }
            break;
        }
      }
    }
  }
}