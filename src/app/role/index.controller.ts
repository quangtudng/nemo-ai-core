import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Role } from "./index.entity";
import { RoleService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@core/constants/user-role";

@ApiTags("roles")
@Controller("roles")
export class RoleController {
  constructor(public service: RoleService) {}

  @ApiOperation({ summary: "Get many roles" })
  @Get()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a role" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR])
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.service.findOneOrFail(id);
  }
}
