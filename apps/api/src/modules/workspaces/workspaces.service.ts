import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

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

  async createDefaultWorkspace(userId: string) {
    // Get user info to create a personalized workspace
    const user = await this.prisma.tbm_user.findUnique({
      where: { id: userId },
      select: { email: true, full_name: true, username: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate workspace name and slug
    const workspaceName = user.full_name 
      ? `${user.full_name}'s Workspace`
      : user.username 
        ? `${user.username}'s Workspace`
        : `${user.email.split('@')[0]}'s Workspace`;

    const baseSlug = user.username || user.email.split('@')[0];
    let slug = baseSlug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Ensure slug is unique
    let counter = 1;
    let finalSlug = slug;
    while (await this.prisma.tbm_workspace.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const workspace = await this.prisma.tbm_workspace.create({
      data: {
        name: workspaceName,
        slug: finalSlug,
        creator_id: userId,
        status: 'Active',
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

    // Create default content types for the new workspace
    await this.createDefaultContentTypes(workspace.id, userId);

    return workspace;
  }

  private async createDefaultContentTypes(workspaceId: string, creatorId: string) {
    // Create a basic "Page" content type
    const pageContent = await this.prisma.tbm_content.create({
      data: {
        name: 'Page',
        slug: 'page',
        workspace_id: workspaceId,
        creator_id: creatorId,
      },
    });

    // Add fields for Page content type
    await this.prisma.tbm_content_field.createMany({
      data: [
        {
          name: 'title',
          display_name: 'Title',
          type: 'TEXT',
          required: true,
          content_id: pageContent.id,
          creator_id: creatorId,
        },
        {
          name: 'slug',
          display_name: 'URL Slug',
          type: 'TEXT',
          required: true,
          placeholder: 'url-friendly-slug',
          content_id: pageContent.id,
          creator_id: creatorId,
        },
        {
          name: 'content',
          display_name: 'Content',
          type: 'RICH_TEXT',
          required: true,
          content_id: pageContent.id,
          creator_id: creatorId,
        },
        {
          name: 'published',
          display_name: 'Published',
          type: 'BOOLEAN',
          required: false,
          default_value: false,
          content_id: pageContent.id,
          creator_id: creatorId,
        },
      ],
    });

    // Create a basic "Blog Post" content type
    const blogContent = await this.prisma.tbm_content.create({
      data: {
        name: 'Blog Post',
        slug: 'blog-post',
        workspace_id: workspaceId,
        creator_id: creatorId,
      },
    });

    // Add fields for Blog Post content type
    await this.prisma.tbm_content_field.createMany({
      data: [
        {
          name: 'title',
          display_name: 'Title',
          type: 'TEXT',
          required: true,
          content_id: blogContent.id,
          creator_id: creatorId,
        },
        {
          name: 'slug',
          display_name: 'URL Slug',
          type: 'TEXT',
          required: true,
          placeholder: 'url-friendly-slug',
          content_id: blogContent.id,
          creator_id: creatorId,
        },
        {
          name: 'excerpt',
          display_name: 'Excerpt',
          type: 'TEXTAREA',
          required: false,
          placeholder: 'Brief description of the post',
          content_id: blogContent.id,
          creator_id: creatorId,
        },
        {
          name: 'content',
          display_name: 'Content',
          type: 'RICH_TEXT',
          required: true,
          content_id: blogContent.id,
          creator_id: creatorId,
        },
        {
          name: 'published',
          display_name: 'Published',
          type: 'BOOLEAN',
          required: false,
          default_value: false,
          content_id: blogContent.id,
          creator_id: creatorId,
        },
        {
          name: 'publish_date',
          display_name: 'Publish Date',
          type: 'DATETIME',
          required: false,
          content_id: blogContent.id,
          creator_id: creatorId,
        },
      ],
    });
  }

  async findAll(paginationDto: PaginationDto, userId: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'created_at', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    let whereClause: any = {
      is_deleted: false,
      OR: [
        { creator_id: userId },
        { members: { some: { user_id: userId, status: 'Active' } } },
      ],
    };

    // Add search functionality
    if (search) {
      whereClause.AND = [
        whereClause.OR ? { OR: whereClause.OR } : {},
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
      delete whereClause.OR;
    }

    const [workspaces, total] = await Promise.all([
      this.prisma.tbm_workspace.findMany({
        where: whereClause,
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
              contents: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.tbm_workspace.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: workspaces,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
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
        contents: {
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