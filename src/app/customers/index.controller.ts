import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Customers } from "./index.entity";
import { CustomerService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  constructor(public service: CustomerService) {}
  @ApiOperation({ summary: "Find many customer" })
  @Get()
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR, USER_ROLE.AGENT])
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a customer" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR, USER_ROLE.AGENT])
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Customers> {
    return this.service.findOneOrFail(id);
  }
}
