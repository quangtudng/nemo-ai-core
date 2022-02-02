import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { Customer } from "./index.entity";
import { CustomerService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import USER_ROLE from "@app/role/data/user-role";
import { SaveInterestDto } from "./dto/save-interest.dto";
import { ServiceService } from "@app/service/index.service";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  constructor(
    public service: CustomerService,
    private serviceService: ServiceService,
  ) {}

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

  @ApiOperation({ summary: "Save customer's interests" })
  @Post("interests")
  saveCustomerInterests(@Body() dto: SaveInterestDto) {
    return this.service.saveCustomerInterests(
      dto.customerLongId,
      dto.interestId,
    );
  }
}
