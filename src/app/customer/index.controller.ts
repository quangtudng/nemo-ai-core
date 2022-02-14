import { Body, Controller, Get, Post } from "@nestjs/common";
import { CustomerService } from "./index.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";
import { SaveInterestDto } from "./dto/save-interest.dto";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  constructor(public service: CustomerService) {}

  @ApiOperation({ summary: "Find many customers by order by last message" })
  @IsAuth()
  @Get()
  async findMany() {
    const customers = await this.service.getAllCustomerAndMessage();
    return {
      data: customers,
    };
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
