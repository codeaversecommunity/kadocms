import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FieldDefinitionDto {
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
  relation_to_id?: string;
}

export class CreateObjectTypeDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  workspace_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  @IsOptional()
  field_definitions?: FieldDefinitionDto[];
}

export class UpdateObjectTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  @IsOptional()
  field_definitions?: FieldDefinitionDto[];
}