import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    // Enhanced logging for debugging
    this.logger.debug(
      `JWT Auth Guard - handleRequest for ${request.method} ${request.url}`,
      {
        err: err?.message,
        user: !!user,
        info: info?.message,
        hasAuthHeader: !!request.headers.authorization,
        authHeaderStart:
          request.headers.authorization?.substring(0, 20) + "...",
        contentType: request.headers["content-type"],
      }
    );

    if (err || !user) {
      // More specific error messages
      if (info?.message === "No auth token") {
        this.logger.warn(
          `No auth token provided for ${request.method} ${request.url}`
        );
        throw new UnauthorizedException(
          "Authorization header is missing. Please include a valid JWT token."
        );
      }

      if (info?.message === "jwt expired") {
        this.logger.warn(
          `JWT token expired for ${request.method} ${request.url}`
        );
        throw new UnauthorizedException(
          "JWT token has expired. Please login again."
        );
      }

      if (info?.message === "invalid token") {
        this.logger.warn(
          `Invalid JWT token for ${request.method} ${request.url}`
        );
        throw new UnauthorizedException(
          "Invalid JWT token. Please login again."
        );
      }

      this.logger.error(
        `Authentication failed for ${request.method} ${request.url}:`,
        {
          error: err?.message,
          info: info?.message,
        }
      );

      throw (
        err ||
        new UnauthorizedException("Authentication failed. Please login again.")
      );
    }

    this.logger.debug(`Authentication successful for user: ${user.id}`);
    return user;
  }
}
