import { User } from "@app/user/index.entity";
import { ENTITY_MESSAGE, HTTP_MESSAGE } from "@core/constants/error-message";
import USER_STATUS from "@core/constants/user-status";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * @Usage The main authentication guard used to implement to JWT authenticated routes
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: User, info: any): any {
    if (info?.message === "No auth token")
      throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
    if (info?.message === "jwt expired")
      throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
    if (info?.message)
      throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
    if (!user) {
      throw new NotFoundException(ENTITY_MESSAGE.USER_NOT_FOUND);
    }
    if (user.status === USER_STATUS.DISABLED) {
      throw new BadRequestException(ENTITY_MESSAGE.USER_IS_DISABLED);
    }
    return user;
  }
}
