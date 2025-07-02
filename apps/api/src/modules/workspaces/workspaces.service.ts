import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, creatorId: string) {
    return this.prisma.tbm_workspace.create({
      data: {
        ...createWorkspaceDto,
        creator_id: creatorId,
      },
      include: {
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

  async findAll(userId: string) {
    return this.prisma.tbm_workspace.findMany({
      where: {
        is_deleted: false,
        OR: [
          { creator_id: userId },
          { members: { some: { user_id: userId, status: 'Active' } } },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
            username: true,
          },
        },
        _count: {
          select: {
            members: true,
            object_types: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id, is_deleted: false },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
            username: true,
          },
        },
        members: {
          where: { is_deleted: false },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                full_name: true,
                username: true,
              },
            },
          },
        },
        object_types: {
          where: { is_deleted: false },
          select: {
            id: true,
            name: true,
            slug: true,
            created_at: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user has access to this workspace
    const hasAccess = workspace.creator_id === userId || 
      workspace.members.some(member => member.user_id === userId && member.status === 'Active');

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto, userId: string) {
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.creator_id !== userId) {
      throw new ForbiddenException('Only workspace creator can update workspace');
    }

    return this.prisma.tbm_workspace.update({
      where: { id },
      data: {
        ...updateWorkspaceDto,
        modifier_id: userId,
        updated_at: new Date(),
      },
      include: {
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
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id, is_deleted: false },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.creator_id !== userId) {
      throw new ForbiddenException('Only workspace creator can delete workspace');
    }

    return this.prisma.tbm_workspace.update({
      where: { id },
      data: { 
        is_deleted: true, 
        modifier_id: userId,
        updated_at: new Date() 
      },
    });
  }
}