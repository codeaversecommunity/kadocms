import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateContentDto, UpdateContentDto } from "./dto/content.dto";

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async validateSlug(slug: string) {
    const content = await this.prisma.tbm_content.findFirst({
      where: {
        OR: [{ id: slug }, { slug: slug }],
        is_deleted: false,
      },
    });

    return {
      exists: !!content,
      message: content
        ? "Content type with this slug already exists"
        : "Slug is available",
    };
  }

  async create({
    createContentDto,
    creatorId,
    workspace_id,
  }: {
    createContentDto: CreateContentDto;
    creatorId: string;
    workspace_id: string;
  }) {
    const { field_definitions, ...contentData } = createContentDto;

    // Check if user has access to workspace
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: creatorId, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== creatorId && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    return this.prisma.tbm_content.create({
      data: {
        ...contentData,
        workspace_id,
        creator_id: creatorId,
        field_definitions: {
          create:
            field_definitions?.map((field) => ({
              ...field,
              creator_id: creatorId,
            })) || [],
        },
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
          where: { user_id: userId, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== userId && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    return this.prisma.tbm_content.findMany({
      where: {
        workspace_id: workspaceId,
        is_deleted: false,
      },
      include: {
        // field_definitions: {
        //   where: { is_deleted: false },
        //   include: {
        //     relation_to_content: {
        //       select: {
        //         id: true,
        //         name: true,
        //         slug: true,
        //       },
        //     },
        //   },
        // },
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findOne(id: string, userId: string) {
    const content = await this.prisma.tbm_content.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
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
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!content) {
      throw new NotFoundException("Content type not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: content.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== userId && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto, userId: string) {
    const content = await this.prisma.tbm_content.findUnique({
      where: { id, is_deleted: false },
      include: { workspace: true },
    });

    if (!content) {
      throw new NotFoundException("Content type not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: content.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== userId && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    const { field_definitions, ...contentData } = updateContentDto;

    return this.prisma.tbm_content.update({
      where: { id },
      data: {
        ...contentData,
        modifier_id: userId,
        updated_at: new Date(),
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
    const content = await this.prisma.tbm_content.findUnique({
      where: { id, is_deleted: false },
    });

    if (!content) {
      throw new NotFoundException("Content type not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: content.workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: userId, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== userId && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    return this.prisma.tbm_content.update({
      where: { id },
      data: {
        is_deleted: true,
        modifier_id: userId,
        updated_at: new Date(),
      },
    });
  }
}
