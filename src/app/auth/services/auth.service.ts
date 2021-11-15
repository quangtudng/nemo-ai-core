import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "@app/user/index.service";
import { User } from "@app/user/index.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { AuthIdentity } from "../index.entity";
import { AuthRepository } from "../index.repository";
import { compareHashString } from "@core/utils/hash/bcrypt";
import { REFRESH_TOKEN_SECRET } from "@config/env";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import {
  ENTITY_MESSAGE,
  HTTP_MESSAGE,
  VALIDATION_MESSAGE,
} from "@core/constants/error-message";
import { TokenService } from "./jwt.service";
import USER_ROLE from "@core/constants/user-role";
import USER_STATUS from "@core/constants/user-status";
import { UserRepository } from "@app/user/index.repository";

@Injectable()
export class AuthService extends BaseCrudService<AuthIdentity> {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private repo: AuthRepository,
    private userRepository: UserRepository,
  ) {
    super(repo);
  }

  async signin(dto: AuthCredentialsDto) {
    const user = await this.userService.findOne({
      where: {
        email: dto.email,
      },
      select: ["id", "password", "status"],
    });

    if (!user)
      throw new BadRequestException(VALIDATION_MESSAGE.INCORRECT_CREDENTIAL);
    if (user.status === USER_STATUS.DISABLED)
      throw new BadRequestException(ENTITY_MESSAGE.USER_IS_DISABLED);

    const isSamePassword = await compareHashString(dto.password, user.password);

    if (!isSamePassword)
      throw new BadRequestException(VALIDATION_MESSAGE.INCORRECT_CREDENTIAL);

    const { accessToken, refreshToken } = this.tokenService.generateAuthToken(
      { id: user.id },
      true,
    );
    await this.repo.saveRefreshToken(user, refreshToken);
    return { accessToken, refreshToken };
  }

  async getMe(id: number): Promise<User> {
    return this.userService.findOneOrFail(id);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    const identity = await this.repo.findOneOrFail({
      where: { refreshToken: dto.refreshToken },
      relations: ["user"],
      select: ["id", "refreshToken", "user"],
    });
    await this.tokenService.verifyAuthToken(
      dto.refreshToken,
      REFRESH_TOKEN_SECRET,
    );
    const { accessToken, refreshToken } = this.tokenService.generateAuthToken(
      { id: identity.user.id },
      true,
    );
    await this.repo.updateTokenOrFail(dto.refreshToken, refreshToken);
    return { accessToken, refreshToken };
  }

  async revokeToken(dto: RefreshTokenDTO) {
    return this.repo.updateTokenOrFail(dto.refreshToken, null);
  }

  async enableUserAccount(id: number) {
    const user = await this.userService.findOneOrFail(id, {
      relations: ["role"],
    });
    if (user.role.num === USER_ROLE.SUPERADMIN)
      throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
    if (user.status === USER_STATUS.ACTIVE)
      throw new BadRequestException(HTTP_MESSAGE.USER_ALREADY_ACTIVE);
    user.status = USER_STATUS.ACTIVE;
    return this.userRepository.save(user);
  }

  async disableUserAccount(id: number) {
    const user = await this.userService.findOneOrFail(id, {
      relations: ["role"],
    });
    if (user.role.num === USER_ROLE.SUPERADMIN)
      throw new UnauthorizedException(HTTP_MESSAGE.UNAUTHORIZED);
    if (user.status === USER_STATUS.DISABLED)
      throw new BadRequestException(HTTP_MESSAGE.USER_ALREADY_DISABLED);
    user.status = USER_STATUS.DISABLED;
    return this.userRepository.save(user);
  }
}
