import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@app/user/index.service";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { AuthIdentity } from "../index.entity";
import { AuthRepository } from "../index.repository";
import { compareHashString, hashString } from "@core/utils/hash/bcrypt";
import { REFRESH_TOKEN_SECRET } from "@config/env";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import {
  ENTITY_MESSAGE,
  VALIDATION_MESSAGE,
} from "@core/constants/error-message";
import { TokenService } from "./jwt.service";
import USER_STATUS from "@app/user/data/user-status";
import { UserRepository } from "@app/user/index.repository";
import { User } from "@app/user/index.entity";
import { UpdateMeDTO } from "../dto/update-me.dto";

@Injectable()
export class AuthService extends BaseCrudService<AuthIdentity> {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {
    super(authRepository);
  }

  async signin(body: AuthCredentialsDto) {
    const user = await this.userService.findOne({
      where: {
        email: body.email,
      },
      relations: ["role"],
      select: [
        "id",
        "email",
        "password",
        "fullname",
        "status",
        "bio",
        "phoneNumber",
        "avatar",
      ],
    });

    if (!user)
      throw new BadRequestException(VALIDATION_MESSAGE.INCORRECT_CREDENTIAL);
    if (user.status === USER_STATUS.DISABLED)
      throw new BadRequestException(ENTITY_MESSAGE.USER_IS_DISABLED);

    const isSamePassword = await compareHashString(
      body.password,
      user.password,
    );

    if (!isSamePassword)
      throw new BadRequestException(VALIDATION_MESSAGE.INCORRECT_CREDENTIAL);

    const { accessToken, refreshToken } = this.tokenService.generateAuthToken(
      { id: user.id },
      true,
    );
    await this.authRepository.saveRefreshToken(user, refreshToken);
    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      status: user.status,
      role: user.role,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      avatar: user.avatar,
    };
  }

  async getMe(id: number) {
    const user = await this.userService.findOneOrFail({
      where: {
        id,
      },
      relations: ["role"],
      select: [
        "id",
        "email",
        "password",
        "fullname",
        "status",
        "bio",
        "phoneNumber",
        "avatar",
      ],
    });
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      status: user.status,
      role: user.role,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      avatar: user.avatar,
    };
  }

  async updateMe(user: User, dto: UpdateMeDTO): Promise<User> {
    if (dto.password) {
      dto.password = await hashString(dto.password);
    }
    return this.userRepository.updateOne(user.id, dto);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    const identity = await this.authRepository.findOneOrFail({
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
    await this.authRepository.updateTokenOrFail(dto.refreshToken, refreshToken);
    return { accessToken, refreshToken };
  }

  async revokeToken(dto: RefreshTokenDTO) {
    return this.authRepository.updateTokenOrFail(dto.refreshToken, null);
  }
}
