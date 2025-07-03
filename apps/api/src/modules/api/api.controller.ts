import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Req,
} from "@nestjs/common";
import { ApiService } from "./api.service";
import { Public } from "../auth/decorators/public.decorator";
import { Request } from "express";

@Controller("api")
@Public()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get(":workspace_slug/:content_slug")
  async getEntries(
    @Param("workspace_slug") workspaceSlug: string,
    @Param("content_slug") contentSlug: string,
    @Req() request: Request,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort?: string,
    @Query("order") order?: "asc" | "desc"
  ) {
    const queryParams = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sort: sort || "created_at",
      order: order || ("desc" as "desc"),
    };

    const clientIp =
      request.ip || request.connection.remoteAddress || "unknown";

    return this.apiService.getPublicEntries(
      workspaceSlug,
      contentSlug,
      queryParams,
      clientIp
    );
  }

  @Get(":workspace_slug/:content_slug/:entry_id")
  async getEntry(
    @Param("workspace_slug") workspaceSlug: string,
    @Param("content_slug") contentSlug: string,
    @Param("entry_id") entryId: string,
    @Req() request: Request
  ) {
    const clientIp =
      request.ip || request.connection.remoteAddress || "unknown";

    return this.apiService.getPublicEntry(
      workspaceSlug,
      contentSlug,
      entryId,
      clientIp
    );
  }
}
