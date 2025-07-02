import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  object_type_id: string;

  @IsObject()
  data: Record<string, any>;
}

export class UpdateEntryDto {
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class QueryEntriesDto {
  @IsString()
  @IsOptional()
  object_type_id?: string;

  @IsString()
  @IsOptional()
  workspace_id?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';
}