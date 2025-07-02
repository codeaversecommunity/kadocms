import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Suspended'])
  status?: string;
}

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Suspended'])
  status?: string;

  @IsString()
  @IsOptional()
  stripe_customer_id?: string;

  @IsString()
  @IsOptional()
  stripe_subscription_id?: string;

  @IsString()
  @IsOptional()
  subscription_status?: string;

  @IsString()
  @IsOptional()
  plan_type?: string;
}