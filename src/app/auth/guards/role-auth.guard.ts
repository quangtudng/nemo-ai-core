import { Role } from "@app/role/index.entity";
import { User } from "@app/user/index.entity";
import UserRole from "@core/constants/user-role";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * @Usage The main authentication guard used to implement to authorization routes
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private checkUserAccess(
    serverAccess: Array<number>,
    clientAccess: Array<Role>,
  ): boolean {
    return true;
  }

  canActivate(context: ExecutionContext): boolean {
    const access = this.reflector?.get<any>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    return true;
  }
}
