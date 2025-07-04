import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CloudinaryService } from "./cloudinary.service";
import { CreateMediaDto, UpdateMediaDto, QueryMediaDto } from "./dto/media.dto";
import { PaginatedResult } from "../../common/dto/pagination.dto";

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    createMediaDto: CreateMediaDto,
    userId: string
  ) {
    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: createMediaDto.workspace_id, is_deleted: false },
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

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("File type not supported");
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        "File size too large. Maximum 10MB allowed."
      );
    }

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await this.cloudinaryService.uploadFile(file, {
        folder: `kadocms/${workspace.slug}`,
        resource_type: file.mimetype.startsWith("video/") ? "video" : "auto",
      });

      // Determine media type
      let mediaType = "FILE";
      if (file.mimetype.startsWith("image/")) {
        mediaType = "IMAGE";
      } else if (file.mimetype.startsWith("video/")) {
        mediaType = "VIDEO";
      } else if (file.mimetype === "application/pdf") {
        mediaType = "DOCUMENT";
      }

      // Save to database
      const media = await this.prisma.tbm_media.create({
        data: {
          name: createMediaDto.name || file.originalname,
          media_type: mediaType,
          file_size: file.size,
          file_path: cloudinaryResult.secure_url,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          alt_text: createMediaDto.alt_text,
          description: createMediaDto.description,
          workspace_id: createMediaDto.workspace_id,
          creator_id: userId,
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
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return {
        ...media,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_url: cloudinaryResult.secure_url,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async uploadBase64(
    base64Data: string,
    createMediaDto: CreateMediaDto,
    userId: string
  ) {
    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: createMediaDto.workspace_id, is_deleted: false },
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

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await this.cloudinaryService.uploadBase64(
        base64Data,
        {
          folder: `kadocms/${workspace.slug}`,
        }
      );

      // Save to database
      const media = await this.prisma.tbm_media.create({
        data: {
          name: createMediaDto.name || "Uploaded Image",
          media_type: "IMAGE",
          file_size: cloudinaryResult.bytes,
          file_path: cloudinaryResult.secure_url,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          alt_text: createMediaDto.alt_text,
          description: createMediaDto.description,
          workspace_id: createMediaDto.workspace_id,
          creator_id: userId,
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
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return {
        ...media,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_url: cloudinaryResult.secure_url,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async findAll({
    queryDto,
    user_id,
    workspace_id,
  }: {
    queryDto: QueryMediaDto;
    workspace_id: string;
    user_id: string;
  }): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      media_type,
      sortBy = "created_at",
      sortOrder = "desc",
    } = queryDto;

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: workspace_id, is_deleted: false },
      include: {
        members: {
          where: { user_id: user_id, status: "Active" },
        },
      },
    });

    if (
      !workspace ||
      (workspace.creator_id !== user_id && workspace.members.length === 0)
    ) {
      throw new ForbiddenException("You do not have access to this workspace");
    }

    const skip = (page - 1) * limit;

    let whereClause: any = {
      workspace_id,
      is_deleted: false,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { alt_text: { contains: search, mode: "insensitive" } },
      ];
    }

    if (media_type) {
      whereClause.media_type = media_type;
    }

    const [media, total] = await Promise.all([
      this.prisma.tbm_media.findMany({
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
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.tbm_media.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: media,
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
    const media = await this.prisma.tbm_media.findUnique({
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
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException("Media not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: media.workspace_id, is_deleted: false },
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

    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto, userId: string) {
    const media = await this.prisma.tbm_media.findUnique({
      where: { id, is_deleted: false },
      include: { workspace: true },
    });

    if (!media) {
      throw new NotFoundException("Media not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: media.workspace_id, is_deleted: false },
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

    return this.prisma.tbm_media.update({
      where: { id },
      data: {
        ...updateMediaDto,
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
    const media = await this.prisma.tbm_media.findUnique({
      where: { id, is_deleted: false },
    });

    if (!media) {
      throw new NotFoundException("Media not found");
    }

    // Check workspace access
    const workspace = await this.prisma.tbm_workspace.findUnique({
      where: { id: media.workspace_id, is_deleted: false },
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

    try {
      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicIdFromUrl(media.file_path);

      // Delete from Cloudinary
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }

      // Soft delete from database
      return this.prisma.tbm_media.update({
        where: { id },
        data: {
          is_deleted: true,
          modifier_id: userId,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      // If Cloudinary deletion fails, still soft delete from database
      console.warn("Failed to delete from Cloudinary:", error.message);

      return this.prisma.tbm_media.update({
        where: { id },
        data: {
          is_deleted: true,
          modifier_id: userId,
          updated_at: new Date(),
        },
      });
    }
  }

  async generateTransformationUrl(
    id: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
    },
    userId: string
  ) {
    const media = await this.findOne(id, userId);

    const publicId = this.extractPublicIdFromUrl(media.file_path);
    if (!publicId) {
      throw new BadRequestException("Invalid media file path");
    }

    const transformedUrl = this.cloudinaryService.generateTransformationUrl(
      publicId,
      transformations
    );

    return {
      original_url: media.file_path,
      transformed_url: transformedUrl,
      transformations,
    };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/kadocms/image/upload/v1234567890/kadocms/workspace/filename.jpg
      const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
      return matches ? matches[1] : null;
    } catch (error) {
      return null;
    }
  }
}
