import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreateContentEntryDto,
  UpdateContentEntryDto,
  QueryContentEntriesDto,
} from "./dto/content-entry.dto";

@Injectable()
export class ContentEntriesService {
  constructor(private prisma: PrismaService) {}

  async create({
    createContentEntryDto,
    creatorId,
  }: {
    createContentEntryDto: CreateContentEntryDto;
    creatorId: string;
  }) {
    // Get content type with field definitions
    const content = await this.prisma.tbm_content.findUnique({
      where: { id: createContentEntryDto.content_id, is_deleted: false },
      include: {
        field_definitions: {
          where: { is_deleted: false },
        },
        workspace: true,
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

    // Validate data against field definitions
    this.validateEntryData(
      createContentEntryDto.data,
      content.field_definitions
    );

    return this.prisma.tbm_content_entry.create({
      data: {
        ...createContentEntryDto,

        creator_id: creatorId,
      },
      include: {
        content: {
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

  async findAll({
    queryDto,
    userId,
    workspace_id,
  }: {
    queryDto: QueryContentEntriesDto;
    userId: string;
    workspace_id: string;
  }) {
    const {
      content_id,
      page = 1,
      limit = 10,
      sort = "created_at",
      order = "desc",
    } = queryDto;

    let whereClause: any = { is_deleted: false };

    if (content_id) {
      whereClause.content_id = content_id;
    }

    if (workspace_id) {
      whereClause.content = {
        workspace_id: workspace_id,
      };
    }

    // Check workspace access if workspace_id is provided
    if (workspace_id) {
      const workspace = await this.prisma.tbm_workspace.findUnique({
        where: { id: workspace_id, is_deleted: false },
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
        throw new ForbiddenException(
          "You do not have access to this workspace"
        );
      }
    }

    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      this.prisma.tbm_content_entry.findMany({
        where: whereClause,
        include: {
          content: {
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
      this.prisma.tbm_content_entry.count({
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

  async findOne({ id, userId }: { id: string; userId: string }) {
    const entry = await this.prisma.tbm_content_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        content: {
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
      throw new NotFoundException("Content entry not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.content.workspace_id, is_deleted: false },
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

    return entry;
  }

  async update({
    id,
    updateContentEntryDto,
    userId,
  }: {
    id: string;
    updateContentEntryDto: UpdateContentEntryDto;
    userId: string;
  }) {
    const entry = await this.prisma.tbm_content_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        content: {
          include: {
            field_definitions: {
              where: { is_deleted: false },
            },
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException("Content entry not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.content.workspace_id, is_deleted: false },
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

    // Validate data against field definitions
    if (updateContentEntryDto.data) {
      this.validateEntryData(
        updateContentEntryDto.data,
        entry.content.field_definitions
      );
    }

    return this.prisma.tbm_content_entry.update({
      where: { id },
      data: {
        ...updateContentEntryDto,
        modifier_id: userId,
        updated_at: new Date(),
      },
      include: {
        content: {
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

  async remove({ id, userId }: { id: string; userId: string }) {
    const entry = await this.prisma.tbm_content_entry.findUnique({
      where: { id, is_deleted: false },
      include: {
        content: true,
      },
    });

    if (!entry) {
      throw new NotFoundException("Content entry not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: entry.content.workspace_id, is_deleted: false },
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

    return this.prisma.tbm_content_entry.update({
      where: { id },
      data: {
        is_deleted: true,
        modifier_id: userId,
        updated_at: new Date(),
      },
    });
  }

  private validateEntryData(
    data: Record<string, any>,
    fieldDefinitions: any[]
  ) {
    for (const field of fieldDefinitions) {
      if (
        field.required &&
        (data[field.name] === undefined || data[field.name] === null)
      ) {
        throw new BadRequestException(
          `Field '${field.display_name}' is required`
        );
      }

      if (data[field.name] !== undefined) {
        // Basic type validation
        switch (field.type) {
          case "NUMBER":
            if (typeof data[field.name] !== "number") {
              throw new BadRequestException(
                `Field '${field.display_name}' must be a number`
              );
            }
            break;
          case "BOOLEAN":
            if (typeof data[field.name] !== "boolean") {
              throw new BadRequestException(
                `Field '${field.display_name}' must be a boolean`
              );
            }
            break;
          case "EMAIL":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data[field.name])) {
              throw new BadRequestException(
                `Field '${field.display_name}' must be a valid email`
              );
            }
            break;
        }
      }
    }
  }
}
