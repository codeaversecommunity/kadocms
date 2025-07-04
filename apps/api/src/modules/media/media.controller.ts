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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";
import {
  CreateMediaDto,
  UpdateMediaDto,
  QueryMediaDto,
  UploadBase64Dto,
  TransformationDto,
} from "./dto/media.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { tbm_user } from "@prisma/client";

@Controller("media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto,
    @CurrentUser() user: tbm_user
  ) {
    this.logger.debug(
      `Upload request from user: ${user.id}, file: ${file?.originalname}`
    );

    if (!file) {
      throw new BadRequestException("No file provided");
    }

    return this.mediaService.uploadFile({
      file,
      createMediaDto,
      user_id: user.id,
      workspace_id: String(user.workspace_id),
    });
  }

  @Post("upload-base64")
  async uploadBase64(
    @Body() uploadBase64Dto: UploadBase64Dto,
    @CurrentUser() user: tbm_user
  ) {
    const { base64_data, ...createMediaDto } = uploadBase64Dto;
    return this.mediaService.uploadBase64({
      base64Data: base64_data,
      createMediaDto,
      user_id: user.id,
      workspace_id: String(user.workspace_id),
    });
  }

  @Get()
  findAll(@Query() queryDto: QueryMediaDto, @CurrentUser() user: tbm_user) {
    return this.mediaService.findAll({
      queryDto,
      user_id: user.id,
      workspace_id: String(user.workspace_id),
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: tbm_user) {
    return this.mediaService.findOne(id, user.id);
  }

  @Get(":id/transform")
  generateTransformationUrl(
    @Param("id") id: string,
    @Query() transformationDto: TransformationDto,
    @CurrentUser() user: tbm_user
  ) {
    return this.mediaService.generateTransformationUrl(
      id,
      transformationDto,
      user.id
    );
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @CurrentUser() user: tbm_user
  ) {
    return this.mediaService.update(id, updateMediaDto, user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: tbm_user) {
    return this.mediaService.remove(id, user.id);
  }
}
