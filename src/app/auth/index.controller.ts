import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetAuthUser } from "@app/auth/decorators/get-auth-user.decorator";
import { AuthService } from "./services/auth.service";
import { UserService } from "@app/user/index.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import { IsAuth } from "./decorators/is-auth.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import USER_ROLE from "@core/constants/user-role";
import { UpdateMeDTO } from "./dto/update-me.dto";
import { User } from "@app/user/index.entity";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    public authService: AuthService,
    public usersService: UserService,
  ) {}

  @ApiOperation({ summary: "Get current user using token" })
  @Get("/me")
  @IsAuth()
  getProfile(@GetAuthUser() user: any) {
    return this.authService.getMe(user.id);
  }

  @ApiOperation({ summary: "Update current user using token" })
  @Post("/me")
  @IsAuth()
  updateProfile(@GetAuthUser() user: User, @Body() dto: UpdateMeDTO) {
    return this.authService.updateMe(user, dto);
  }

  @ApiOperation({ summary: "Login and get current user" })
  @Post("/signin")
  signin(@Body() dto: AuthCredentialsDto) {
    return this.authService.signin(dto);
  }

  @ApiOperation({ summary: "Get new tokens using refresh token" })
  @Post("/refresh-token")
  async refreshToken(@Body() dto: RefreshTokenDTO) {
    return this.authService.refreshToken(dto);
  }

  @ApiOperation({ summary: "Admin revoke a user refresh token" })
  @Post("/revoke-token")
  @IsAuth([USER_ROLE.SUPERADMIN])
  async revokeToken(@Body() dto: RefreshTokenDTO) {
    return this.authService.revokeToken(dto);
  }
}
