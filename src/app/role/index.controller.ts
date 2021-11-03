import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Role } from "./index.entity";
import { RoleService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("roles")
@Controller("roles")
export class RoleController {
  constructor(public service: RoleService) {}

  @ApiOperation({ summary: "Get many roles" })
  @Get()
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a role" })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Role> {
    return this.service.findOneOrFail(id);
  }
}
