import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetAuthUser } from "@app/auth/decorators/get-auth-user.decorator";
import { AuthService } from "./services/auth.service";
import { UserService } from "@app/user/index.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";
import { IsAuth } from "./decorators/is-auth.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import USER_ROLE from "@app/role/data/user-role";
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
  updateProfile(@GetAuthUser() user: User, @Body() body: UpdateMeDTO) {
    return this.authService.updateMe(user, body);
  }

  @ApiOperation({ summary: "Login and get current user" })
  @Post("/signin")
  signin(@Body() body: AuthCredentialsDto) {
    return this.authService.signin(body);
  }

  @ApiOperation({ summary: "Get new tokens using refresh token" })
  @Post("/refresh-token")
  async refreshToken(@Body() body: RefreshTokenDTO) {
    return this.authService.refreshToken(body);
  }

  @ApiOperation({ summary: "Admin revoke a user refresh token" })
  @Post("/revoke-token")
  @IsAuth([USER_ROLE.SUPERADMIN])
  async revokeToken(@Body() body: RefreshTokenDTO) {
    return this.authService.revokeToken(body);
  }
}
