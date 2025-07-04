import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloud_name = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    const api_key = this.configService.get<string>("CLOUDINARY_API_KEY");
    const api_secret = this.configService.get<string>("CLOUDINARY_API_SECRET");

    if (!cloud_name || !api_key || !api_secret) {
      throw new BadRequestException(
        "Cloudinary configuration is not set properly."
      );
    }

    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      folder?: string;
      transformation?: any;
      resource_type?: "image" | "video" | "raw" | "auto";
    }
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: options?.folder || "kadocms",
        resource_type: options?.resource_type || "auto",
        transformation: options?.transformation,
        use_filename: true,
        unique_filename: true,
      };

      cloudinary.uploader
        .upload_stream(
          uploadOptions,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(
                new BadRequestException(`Upload failed: ${error.message}`)
              );
            } else if (result) {
              resolve(result);
            } else {
              reject(new BadRequestException("Upload failed: Unknown error"));
            }
          }
        )
        .end(file.buffer);
    });
  }

  async uploadBase64(
    base64Data: string,
    options?: {
      folder?: string;
      transformation?: any;
      resource_type?: "image" | "video" | "raw" | "auto";
    }
  ): Promise<UploadApiResponse> {
    try {
      const uploadOptions = {
        folder: options?.folder || "kadocms",
        resource_type: options?.resource_type || "auto",
        transformation: options?.transformation,
        use_filename: true,
        unique_filename: true,
      };

      const result = await cloudinary.uploader.upload(
        base64Data,
        uploadOptions
      );
      return result;
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  async getFileInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`Get file info failed: ${error.message}`);
    }
  }

  async updateFile(
    publicId: string,
    options: {
      tags?: string[];
      context?: Record<string, string>;
    }
  ): Promise<any> {
    try {
      const result = await cloudinary.uploader.explicit(publicId, {
        type: "upload",
        tags: options.tags,
        context: options.context,
      });
      return result;
    } catch (error) {
      throw new BadRequestException(`Update failed: ${error.message}`);
    }
  }

  generateTransformationUrl(
    publicId: string,
    transformations: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
      [key: string]: any;
    }
  ): string {
    return cloudinary.url(publicId, transformations);
  }

  async searchFiles(options: {
    expression?: string;
    sort_by?: string;
    max_results?: number;
    next_cursor?: string;
  }): Promise<any> {
    try {
      const result = await cloudinary.search
        .expression(options.expression || "folder:kadocms")
        .sort_by(options.sort_by || "created_at", "desc")
        .max_results(options.max_results || 30)
        .next_cursor(options.next_cursor)
        .execute();
      return result;
    } catch (error) {
      throw new BadRequestException(`Search failed: ${error.message}`);
    }
  }
}
