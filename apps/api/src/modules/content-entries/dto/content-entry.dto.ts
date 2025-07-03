import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateContentEntryDto {
  @IsString()
  content_id: string;

  @IsObject()
  data: Record<string, any>;
}

export class UpdateContentEntryDto {
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class QueryContentEntriesDto {
  @IsString()
  @IsOptional()
  content_id?: string;

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