import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Customer } from "./index.entity";
import { CustomerService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  constructor(public service: CustomerService) {}
  @ApiOperation({ summary: "Find many customers by order by last message" })
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR, USER_ROLE.AGENT])
  @Get()
  async findMany(@Query() _param: BaseFilterDTO) {
    const customers = await this.service.getAllCustomerAndMessage();
    return {
      data: customers,
    };
  }

  @ApiOperation({ summary: "Get a customer" })
  @Get(":id")
  @IsAuth([USER_ROLE.SUPERADMIN, USER_ROLE.MODERATOR, USER_ROLE.AGENT])
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Customer> {
    return this.service.findOneOrFail(id);
  }
}