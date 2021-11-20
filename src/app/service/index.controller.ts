import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-one";
import { UpdateServiceDTO } from "./dto/update-one";
import { Service } from "./index.entity";
import { ServiceService } from "./index.service";
import { BaseFilterDTO } from "@core/dto/filter-many";
import { DeleteResult } from "typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsAuth } from "@app/auth/decorators/is-auth.decorator";

@ApiTags("service")
@Controller("service")
export class ServiceController {
  constructor(public service: ServiceService) {}

  @ApiOperation({ summary: "Create a service" })
  @Post()
  @IsAuth()
  createOne(@Body() dto: CreateServiceDto) {
    return this.service.createOne(dto);
  }

  @ApiOperation({ summary: "Find many service" })
  @Get()
  @IsAuth()
  findMany(@Query() param: BaseFilterDTO) {
    return this.service.findMany(param);
  }

  @ApiOperation({ summary: "Get a service" })
  @Get(":id")
  @IsAuth()
  getOne(@Param("id", ParseIntPipe) id: number): Promise<Service> {
    return this.service.findOneOrFail(id);
  }

  @ApiOperation({ summary: "Update a service" })
  @Patch(":id")
  @IsAuth()
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDTO,
  ): Promise<Service> {
    return this.service.updateOne(id, dto);
  }

  @ApiOperation({ summary: "Delete a service" })
  @Delete(":id")
  @IsAuth()
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteOne(id);
  }
}
