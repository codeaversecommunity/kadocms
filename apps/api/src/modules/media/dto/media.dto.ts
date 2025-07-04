import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from "class-validator";
import { Transform } from "class-transformer";

export class CreateMediaDto {
  @IsString()
  workspace_id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  alt_text?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateMediaDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  alt_text?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UploadBase64Dto extends CreateMediaDto {
  @IsString()
  base64_data: string;
}

export class QueryMediaDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(["IMAGE", "VIDEO", "DOCUMENT", "FILE"])
  media_type?: string;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}

export class TransformationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(2000)
  width?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(2000)
  height?: number;

  @IsOptional()
  @IsEnum(["scale", "fit", "fill", "crop", "thumb"])
  crop?: string;

  @IsOptional()
  quality?: string | number;

  @IsOptional()
  @IsEnum(["jpg", "png", "webp", "gif", "auto"])
  format?: string;
}
