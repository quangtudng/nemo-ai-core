import { User } from "@app/user/index.entity";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * @Usage The main authentication guard used to implement to authorization routes
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const access = this.reflector?.get<any>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!access) {
      return true;
    }
    if (user) {
      return access.includes(user.role.num);
    }
    return false;
  }
}
