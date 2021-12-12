import { User } from "@app/user/index.entity";
import { HTTP_MESSAGE } from "@core/constants/error-message";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * @Usage The main authentication guard used to implement to authorization routes
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector?.get<any>(
      "roles",
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!allowedRoles) {
      return true;
    }
    if (user && user.role) {
      const isAllowed = allowedRoles.includes(user.role.num);
      if (!isAllowed) {
        throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
      }
      return true;
    }
  }
}
