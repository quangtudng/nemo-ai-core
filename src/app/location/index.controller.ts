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
import { LocationService } from "./index.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FilterLocationDTO } from "./dto/filter-tree-many";
import { CreateLocationDto } from "./dto/create-one";
import { Location } from "./index.entity";
import { UpdateLocationDTO } from "./dto/update-one";
import { DeleteResult } from "typeorm";

@ApiTags("locations")
@Controller("locations")
export class LocationController {
  constructor(public service: LocationService) {}

  @ApiOperation({ summary: "Create a location" })
  @ApiResponse({ status: 200, type: Location })
  @Post()
  createOne(@Body() dto: CreateLocationDto): Promise<Location> {
    return this.service.createNode(dto);
  }

  @ApiOperation({ summary: "Get many locations" })
  @Get()
  findMany(@Query() param: FilterLocationDTO) {
    return this.service.findAllNodes(param);
  }

  @ApiOperation({ summary: "Update a location" })
  @Patch(":id")
  updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDTO,
  ): Promise<Location> {
    return this.service.updateNode(id, dto);
  }

  @ApiOperation({ summary: "Delete a location" })
  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.service.deleteNode(id);
  }
}
