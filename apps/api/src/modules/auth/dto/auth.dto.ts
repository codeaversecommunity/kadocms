import { IsEmail, IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class OAuthCallbackDto {
  @IsString()
  access_token: string;

  @IsObject()
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      user_name?: string;
      preferred_username?: string;
      avatar_url?: string;
      picture?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };

  @IsString()
  @IsOptional()
  refresh_token?: string;
}

export class RefreshTokenDto {
  @IsString()
  access_token: string;
}