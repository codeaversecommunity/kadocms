import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ContentFieldDefinitionDto {
  @IsString()
  name: string;

  @IsString()
  display_name: string;

  @IsString()
  type: string;

  @IsOptional()
  required?: boolean;

  @IsOptional()
  multiple?: boolean;

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsOptional()
  default_value?: any;

  @IsString()
  @IsOptional()
  relation_to_content_id?: string;
}

export class CreateContentDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentFieldDefinitionDto)
  @IsOptional()
  field_definitions?: ContentFieldDefinitionDto[];
}

export class UpdateContentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentFieldDefinitionDto)
  @IsOptional()
  field_definitions?: ContentFieldDefinitionDto[];
}
