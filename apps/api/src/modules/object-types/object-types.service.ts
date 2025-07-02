import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateObjectTypeDto, UpdateObjectTypeDto } from './dto/object-type.dto';

@Injectable()
export class ObjectTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createObjectTypeDto: CreateObjectTypeDto, creatorId: string) {
    const { field_definitions, ...objectTypeData } = createObjectTypeDto;

    // Check if user has access to workspace
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: createObjectTypeDto.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: creatorId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== creatorId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return this.prisma.tbm_object_type.create({
      data: {
        ...objectTypeData,
        creator_id: creatorId,
        field_definitions: {
          create: field_definitions?.map(field => ({
            ...field,
            creator_id: creatorId,
          })) || [],
        },
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
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findAll(workspaceId: string, userId: string) {
    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: workspaceId, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return this.prisma.tbm_object_type.findMany({
      where: {
        workspace_id: workspaceId,
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
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const objectType = await this.prisma.tbm_object_type.findUnique({
      where: { id, is_deleted: false },
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
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        entries: {
          where: { is_deleted: false },
          take: 10,
          orderBy: { created_at: 'desc' },
        },
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
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return objectType;
  }

  async update(id: string, updateObjectTypeDto: UpdateObjectTypeDto, userId: string) {
    const objectType = await this.prisma.tbm_object_type.findUnique({
      where: { id, is_deleted: false },
      include: { workspace: true },
    });

    if (!objectType) {
      throw new NotFoundException('Object type not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: objectType.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    const { field_definitions, ...objectTypeData } = updateObjectTypeDto;

    return this.prisma.tbm_object_type.update({
      where: { id },
      data: {
        ...objectTypeData,
        modifier_id: userId,
        updated_at: new Date(),
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
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const objectType = await this.prisma.tbm_object_type.findUnique({
      where: { id, is_deleted: false },
    });

    if (!objectType) {
      throw new NotFoundException('Object type not found');
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: objectType.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: 'Active' },
        },
      },
    });

    if (!workspace || (workspace.creator_id !== userId && workspace.members.length === 0)) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return this.prisma.tbm_object_type.update({
      where: { id },
      data: { 
        is_deleted: true, 
        modifier_id: userId,
        updated_at: new Date() 
      },
    });
  }
}