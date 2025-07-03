import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthCallbackDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/callback')
  @Public()
  async oauthCallback(@Body() callbackDto: OAuthCallbackDto) {
    return this.authService.handleOAuthCallback(callbackDto);
  }

  @Post('oauth/sync')
  @Public()
  async oauthSync(@Body() callbackDto: OAuthCallbackDto) {
    // Alias for callback - some frontends might use different endpoint names
    return this.authService.handleOAuthCallback(callbackDto);
  }

  @Get('oauth/callback')
  @Public()
  async oauthCallbackGet(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() request: Request,
  ) {
    // Handle OAuth redirect from Supabase
    // This endpoint redirects to frontend with the code
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?code=${code}&state=${state}`;
    
    // In a real implementation, you might want to use a proper redirect
    return {
      message: 'OAuth callback received',
      redirectUrl,
      code,
      state,
    };
  }

  @Post('refresh')
  async refreshUserData(
    @CurrentUser() user: any,
    @Body('access_token') accessToken: string,
  ) {
    return this.authService.refreshUserData(user.id, accessToken);
  }
}