import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { OAuthCallbackDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private workspacesService: WorkspacesService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    );
  }

  async handleOAuthCallback(callbackDto: OAuthCallbackDto) {
    const { access_token, user: supabaseUser } = callbackDto;

    if (!supabaseUser || !supabaseUser.email) {
      throw new BadRequestException('Invalid user data from OAuth provider');
    }

    try {
      // Verify the access token with Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(access_token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid access token');
      }

      // Check if user exists in our database
      let dbUser = await this.usersService.findByEmail(supabaseUser.email);
      let isNewUser = false;

      if (!dbUser) {
        // Create new user
        isNewUser = true;
        dbUser = await this.usersService.create({
          email: supabaseUser.email,
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
          username: supabaseUser.user_metadata?.user_name || supabaseUser.user_metadata?.preferred_username,
          avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          email_verified: supabaseUser.email_confirmed_at ? true : false,
        });

        // Create default workspace for new user
        const defaultWorkspace = await this.workspacesService.createDefaultWorkspace(dbUser.id);
        
        // Update user with default workspace
        dbUser = await this.usersService.update(dbUser.id, {
          workspace_id: defaultWorkspace.id,
        });
      } else {
        // Update existing user with latest info from OAuth provider
        dbUser = await this.usersService.update(dbUser.id, {
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || dbUser.full_name,
          username: supabaseUser.user_metadata?.user_name || supabaseUser.user_metadata?.preferred_username || dbUser.username,
          avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || dbUser.avatar,
          email_verified: supabaseUser.email_confirmed_at ? true : dbUser.email_verified,
        });
      }

      // Generate JWT token for our API
      const payload = { sub: dbUser.id, email: dbUser.email };
      const token = this.jwtService.sign(payload);

      return {
        user: dbUser,
        token,
        isNewUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshUserData(userId: string, supabaseAccessToken: string) {
    try {
      // Get latest user data from Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(supabaseAccessToken);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid access token');
      }

      // Update user in our database
      const updatedUser = await this.usersService.update(userId, {
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        username: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        email_verified: user.email_confirmed_at ? true : false,
      });

      return updatedUser;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh user data');
    }
  }
}