import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ContentsService } from "./contents.service";
import { CreateContentDto, UpdateContentDto } from "./dto/content.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { tbm_user } from "@prisma/client";

@Controller("contents")
@UseGuards(JwtAuthGuard)
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  create(
    @Body() createContentDto: CreateContentDto,
    @CurrentUser() user: tbm_user
  ) {
    const workspaceId = String(user.workspace_id);

    console.log("Creating content with DTO:", createContentDto, workspaceId);

    return this.contentsService.create({
      createContentDto,
      creatorId: user.id,
      workspace_id: workspaceId,
    });
  }

  @Get()
  findAll(@CurrentUser() user: tbm_user) {
    const workspaceId = String(user.workspace_id);
    return this.contentsService.findAll(workspaceId, user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: tbm_user) {
    return this.contentsService.findOne(id, user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateContentDto: UpdateContentDto,
    @CurrentUser() user: tbm_user
  ) {
    return this.contentsService.update(id, updateContentDto, user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: tbm_user) {
    return this.contentsService.remove(id, user.id);
  }
}
